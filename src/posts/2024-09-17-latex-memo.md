---
title: LaTeX 编辑技巧备忘
date: 2024-09-17 14:43:32
tags:
---
# LaTeX 编辑技巧备忘

## LaTeX 段落缩进

在 LaTeX 中可以通过插入一个空行或者 `\par` 来实现分段.

默认情况下, LaTeX 不对章或者节内的第一个段落进行缩进, 并且之后段落缩进的大小取决于 `\parindent` 的设置 (`\setlength{\parindent}{4em}`).

缩进的默认大小取决于文档的类型, 如果设置为 `4em`, 则意味着缩进为4个m的宽度.

在此之外, 可以在段落之前使用命令 `\indent` 和 `\noindent` 人为进行控制.

## 段落间距

控制段落间距的参数为 `\parskip`, 指一个段落和之前的文字间距的大小. 使用 `\setlength{\parskip}{1em}` 就可以设置全局段落间距为1em.

## 行距

行距可以通过重定义命令 `\baselinestretch` 来实现, 即 `\renewcommand{\baselinestretch}{1.5}`.