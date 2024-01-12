import React from "react";

export function jsxIf(condition: any, result: React.ReactNode) {
    if (condition) {
        return result;
    }
    return null;
}

export function jsxIfElse(condition: any, positive: React.ReactNode, negative: React.ReactNode) {
    return condition ? positive : negative;
}
