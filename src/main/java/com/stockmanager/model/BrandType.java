package com.stockmanager.model;

public enum BrandType {
    WHISKEY("Whiskey"),
    WINE("Wine"),
    BEER("Beer"),
    SPIRITS("Spirits");

    private String label;

    BrandType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    public static BrandType fromString(String label) {
        for (BrandType type : BrandType.values()) {
            if (type.getLabel().equalsIgnoreCase(label)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown label: " + label);
    }
}
