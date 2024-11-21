package com.stockmanager.model;

// Enum for LiquorQuantity
public enum LiquorQuantity {
    SMALL(175),    // 175 ml
    MEDIUM(375),   // 375 ml
    LARGE(750);   // 750 ml

    private final int quantityInMl;

    LiquorQuantity(int quantityInMl) {
        this.quantityInMl = quantityInMl;
    }

    public int getQuantityInMl() {
        return quantityInMl;
    }

    public static LiquorQuantity fromInt(int label) {
        for (LiquorQuantity quantity : LiquorQuantity.values()) {
            if (quantity.getQuantityInMl() == label) {
                return quantity;
            }
        }
        throw new IllegalArgumentException("Unknown quantity: " + label);
    }

    // Method to get LiquorQuantity from String
    public static int fromString(String quantity) {
        if (quantity == null) {
            throw new IllegalArgumentException("Quantity string cannot be null");
        }
        switch (quantity.toLowerCase()) {
            case "small":
                return SMALL.getQuantityInMl();
            case "medium":
                return MEDIUM.getQuantityInMl();
            case "large":
                return LARGE.getQuantityInMl();
            default:
                throw new IllegalArgumentException("Unknown quantity: " + quantity);
        }
    }
}