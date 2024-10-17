---
title: 「virt」Intel VT-x虚拟化（vmx、vmcs）
date: 2024-03-30 23:40:00
tags: 
- os
- virtualization
---
# 「virt」Intel VT-x虚拟化（vmx、vmcs）

Intel VT-x是Intel的虚硬件辅助拟化方案，TV的意思是Visualization Technology. 硬件辅助虚拟化方案是系统虚拟化技术的一种，重要是用来弥补虚拟化漏洞.

### 虚拟化漏洞
虚拟化系统必须满足三个条件：
- 资源控制：虚拟机对于物理资源的访问都应该在Hypervisor的监控下进行
- 等价：上层应用与物理机运行没有区别，特权指令可以自由执行
- 高效：绝大多数客户机指令可以由主机硬件直接执行

主要是资源控制，另外两个都比较好理解. CPU架构中会触发特权级切换的指令称为*特权指令*，这些指令只能在最高特权级中运行，而操作敏感物理资源的指令称为*敏感指令*，例如I/O指令和页表基地址切换指令等. 资源控制要求访问敏感物理资源的指令都需要在Hypervisor的监控下执行，Hypervisor运行在最高特权级，虚拟机执行敏感指令必须trap进入Hypervisor执行. 这种处理方式要求所有的敏感指令都会触发特权级切换. 然而由于早期x86架构对虚拟化支持不足，存在一系列*敏感非特权指令*. Intel将这些指令称为“**虚拟化漏洞**”.

硬件辅助虚拟化技术就是解决虚拟化漏洞的软件方案之一，笼统的讲，就是在虚拟机执行敏感指令的时候通过超调用主动陷入Hypervisor. Intel VT-x引入了VMX操作模式，包括根模式和非根模式，Hypervisor运行在根模式而虚拟机运行在非根模式. 非根模式中所有的敏感指令都会触发VM-Exit而陷入Hypervisor，让所有敏感指令都会触发异常.

### VMX操作模式
支持VT-x的Intel CPU可以通过VMXON/VMXOFF指令打开或关闭VMX操作模式. Hypervisor运行在VMX根模式，虚拟机运行在非根模式. root和non-root都有Ring0-Ring3特权级，Hypervisor运行在root的Ring0特权级上. VMX下虚拟机执行敏感指令时，从non-root切换到root，称为VM-Exit；从root切换到non-root称为VM-Entry. VMX中敏感非特权指令可以稳定触发VM-Exit，从而陷入Hypervisor进行处理.

Hypervisor处理来自non-root的虚拟机VM-Exit陷入的过程可以简单描述为：
```c
exit_handler () {
	get_exit_reason();
	call_handler();
	return_to_guest();
}
```
用自然语言描述就是：Hypervisor读取VM-Exit相关信息，判断造成VM-Exit的原因（I/O指令触发或是外部中断）并进行处理（handle），处理完成后Hypervisor调用VMX指令VMLAUNCH或VMRESUME指令从root切换到non-root，恢复虚拟机运行.

### VMCS
熟悉操作系统就会发现上述过程有一个问题：特权级切换或者说陷入过程需要**上下文切换**. 确切的说，是虚拟机的vCPU上下文切换. 陷入Hypervisor时需要保存vCPU状态，从Hypervisor返回需要加载vCPU的寄存器状态. VMCS就是用来保存虚拟机和Hypervisor寄存器状态的机制.

VMCS全程Virtual Machine Control Structure，虚拟机控制结构，是内存中的一块区域，用于在VM-Entry和VM-Exit的时候保存和恢复虚拟机和Hypervisor寄存器状态. VMCS与vCPU一一对应，当vCPU被调度到物理CPU的时候，需要将对应的VMCS与物理CPU绑定，才能实现保存和恢复寄存器状态.

VMCS虽然存在内存当中，但是与架构强相关，部分内容可能存在cache当中，所以只能通过Intel VT-x提供的指令来进行读写：VMPTRLD将VMCS与CPU绑定，VMCLEAR将CPU中缓存的数据写入内存VMCS中，并将VMCS与CPU解绑，VMREAD和VMWRITE可以通过索引读写VMCS的数据域.

VMCS的大小不确定，上限为4KB，可以通过查询MSR寄存器组中的IA32_VMX_BASIC[32:44]得到具体的大小. VMCS组成：
- 4KB VMCS版本标识符：指明VMCS数据域的格式
- 4KB VMCS中止指示符：记录VMX中止的原因
- 不确定大小的VMCS数据域

VMCS数据域包含客户机状态域、宿主机状态域、VMX控制域（控制guest os在non-root时哪些行为可以触发VM-Exit）、VM-Exit控制域、VM-Entry控制域和VM-Exit信息域（触发VM-Exit的基本原因和其他信息）.

VMCS独立于Hypervisor，在内存中存在，涉及硬件辅助虚拟化的方方面面，但是主要作用可以概括为：存储和恢复寄存器以及存储VMX控制信息.

### 小结
第一篇只是对Intel VT-x的简单认识，后面会读Intel的手册，主要看看VMX指令. 然后看一下 https://github.com/equation314/RVM-Tutorial 这个.

### 参考文献
深入浅出系统虚拟化原理与实践. 戚正伟, 管海兵. 清华大学出版社.