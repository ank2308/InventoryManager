package com.stockmanager.exception;

public class DuplicateBrandNameException extends RuntimeException {

    public DuplicateBrandNameException(String message) {
        super(message);
    }
}