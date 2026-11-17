// logic gate output evaluation
function gateOutput(g, a, b) {
    if (g === "AND") return a & b;
    if (g === "OR") return a | b;
    if (g === "XNOR") return Number(a === b);
    if (g === "NAND") return Number(!(a & b));
    if (g === "NOR") return Number(!(a | b));
    return 0;
}
