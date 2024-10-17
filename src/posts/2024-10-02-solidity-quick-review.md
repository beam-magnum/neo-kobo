---
title: Solidity Quick Review
date: 2024-10-02 11:45:34
tags:
---
# Solidity Quick Reviews

Solidity seems to be a strange programming language due to its inherent relationship with blockchain and Ethereum, but it is actually quite a simple PL. It does not have a lot of advanced features like Java or C++, or evan Javascript, it is just a script language equipped with some operations designed for Ethereum.

This post marks my fourth attempt at learning Solidity, yet not a systematic approach.

## Value Types

`uintXXX` means unsigned integer with XXX bits, and `uint` is an alias for `uint256`.

`intXXX` means signed integer with XXX bits, and `int` is an alias for `int256`.

`address` is a special type for Ethereum address, both contract address and account address.

Nothing special to say about `bool`.

`#define` in solidity is like `type XXX is uint128`. Its official name is *User Defined Value Types*.

`bytes` is special. It's for binary data, but array in solidity is a little complicated. In general, types like `bytesN` means fixed-sized byte arrays, e.g. `bytes1 public hash = "0x12";` means data of 1 byte length. This **fixed size bytes array** is value type.

## Reference Types

Reference types are the most intriguing part in solidity, since this is a language interacting with a distributed database. For simplicity, **dinamically-sized byte arrays** and **arrays (compile-time fixed size and dynamic size arrays)** are reference types, generally.

That is to say, `bytes` is a reference type (`bytes public data = "hello";` is short for byte[]), types like `uint[]` and `uint[10]` are also reference types.

BTW, there are some useful array memeber (methods): `length`, `push()`, `push(x)`, `pop()`.

Also, slices and structs are reference types, but these are simple.

## Local variables and State variables

**Local** means variables declared in a function and it is not stored on the blockchain.

**State** means variables declared outside a function and it is stored on the blockchain.

The *EVM* is considered as a state machine and check/change data on the blockchain means check/change the state.

> **Global** variables are different, they provide information about the blockchain, like `block.timestamp` and `msg.sender`.

A *transaction* is required to change a state variable, that is, calling a constract method. Read from a state variable does not require a transaction.

## `constant` and `immutable`

There are also **constant** variables, whose value is hard coded to save gas fee: `uint public const MAX_INT = 2**256 - 1;`

**immutable** variables are used in constructors. Their value can be set only once when the contract is deployed. This keyword is suitable for variables like admin address and specific configuration parameters.

These two keywords are special in solidity because they are designed to avoid useless state change to save gas fee. Differ from previous section, they are *keywords* but **local** and **public** are decided by the location variables is declared.

## unit and gas

The minimiun unit of Ether (currency used to pay gas fee in Ethereum) is wei, which is 10^-18 Ether. `wei` is hard-coded in solidity as the number 1 (like `#define`, but not user defined valu types).

There are 2 upper bound in Ethereum to avoid abuse. One is gas limit set by the user, which is the max amount of gas a transaction can use. The other is block gas limit, which is set by the network as the max amount of gas allowed in a block.

## Control flow (if/else, for/while loop)

Exactly the same as C.

## Mapping

Syntax `mapping(keyType => valueType)` made up a data type which maps a **built-in value type** to whatever type you want (arrays or maps).

Maps are not iteratable.

## Object Oriented Programming

### Structs