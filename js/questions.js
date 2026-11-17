// Hacker Highway -- Question Bank //

window.questions = [
    // Lane 1: Basic Logic Gates and Simple Outputs
    {
        id: 1,
        lane: 1,
        difficulty: "Very Easy",
        type: "multiple-choice",
        question: "An AND gate receives two inputs: A = 1 and B = 0. What is the output?",
        choices: [
            { label: "A", text: "1" },
            { label: "B", text: "0" },
            { label: "C", text: "2" }
        ],
        answer: "B"
    },
    {
        id: 2,
        lane: 1,
        difficulty: "Very Easy",
        type: "multiple-choice",
        question: "A NOT gate receives an input of 1. What is its output?",
        choices: [
            { label: "A", text: "0" },
            { label: "B", text: "1" },
            { label: "C", text: "2" }
        ],
        answer: "A"
    },
    {
        id: 3,
        lane: 1,
        difficulty: "Very Easy",
        type: "multiple-choice",
        question: "A half-adder receives inputs A = 0 and B = 1. What are the Sum and Carry-out values?",
        choices: [
            { label: "A", text: "Sum = 0, Carry-out = 1" },
            { label: "B", text: "Sum = 1, Carry-out = 1" },
            { label: "C", text: "Sum = 1, Carry-out = 0" }
        ],
        answer: "C"
    },
    // Lane 2: Binary Numbers and 2-Input Truth Tables
    {
        id: 4,
        lane: 2,
        difficulty: "Easy",
        type: "multiple-choice",
        question: "A 6-bit XOR gate receives A = 101001 and B = 100101. What is the output?",
        choices: [
            { label: "A", text: "101001" },
            { label: "B", text: "001100" },
            { label: "C", text: "110010" },
            { label: "D", text: "001110" }
        ],
        answer: "B"
    },
    {
        id: 5,
        lane: 2,
        difficulty: "Easy",
        type: "truth-table",
        question: "Which logic gate is represented by the following truth table?",
        table: {
            headers: ["A", "B", "Output"],
            rows: [
                [0, 0, 0],
                [0, 1, 1],
                [1, 0, 1],
                [1, 1, 1]
            ]
        },
        choices: [
            { label: "A", text: "AND" },
            { label: "B", text: "XOR" },
            { label: "C", text: "OR" },
            { label: "D", text: "XNOR" }
        ],
        answer: "C"
    },
    {
        id: 6,
        lane: 2,
        difficulty: "Easy",
        type: "multiple-choice",
        question: "A half-adder receives inputs A = 1 and B = 1. What are the Sum and Carry-out values?",
        choices: [
            { label: "A", text: "Sum = 0, Carry-out = 1" },
            { label: "B", text: "Sum = 1, Carry-out = 0" },
            { label: "C", text: "Sum = 1, Carry-out = 1" },
            { label: "D", text: "Sum = 0, Carry-out = 0" }
        ],
        answer: "A"
    },
    // Lane 3: Multi-Gate Circuits and Half Adders
    {
        id: 7,
        lane: 3,
        difficulty: "Medium",
        type: "truth-table-completion",
        question: "Complete the following XNOR truth table by filling in the missing values.",
        table: {
            headers: ["A", "B", "Output"],
            rows: [
                [0, 0, null],
                [0, null, 0],
                [1, 0, null],
                [null, 1, 1]
            ]
        },
        // Answers correspond to the blanks in row-major order.
        answer: [1, 1, 0, 1]
    },
    {
        id: 8,
        lane: 3,
        difficulty: "Medium",
        type: "multiple-choice",
        question: "A full-adder receives A = 1, B = 0, and Carry-in = 1. What are the Sum and Carry-out values?",
        choices: [
            { label: "A", text: "Sum = 0, Carry-out = 1" },
            { label: "B", text: "Sum = 1, Carry-out = 0" },
            { label: "C", text: "Sum = 1, Carry-out = 1" }
        ],
        answer: "A"
    },
    {
        id: 9,
        lane: 3,
        difficulty: "Medium",
        type: "multiple-choice",
        question: "Evaluate the Boolean expression (A · B) + C when A = 1, B = 0, and C = 1.",
        choices: [
            { label: "A", text: "0" },
            { label: "B", text: "2" },
            { label: "C", text: "1" }
        ],
        answer: "C"
    },
    // Lane 4: Full Adders and Boolean Expressions
    {
        id: 10,
        lane: 4,
        difficulty: "Hard",
        type: "multiple-choice",
        question: "Using De Morgan's Law, which expression is equivalent to (A + B)'?",
        choices: [
            { label: "A", text: "A' + B'" },
            { label: "B", text: "A' · B'" },
            { label: "C", text: "A · B'" },
            { label: "D", text: "A' · B" }
        ],
        answer: "B"
    },
    {
        id: 11,
        lane: 4,
        difficulty: "Hard",
        type: "multiple-choice",
        question: "A full-adder receives A = 1, B = 1, and Carry-in = 1. What are the Sum and Carry-out values?",
        choices: [
            { label: "A", text: "Sum = 0, Carry-out = 1" },
            { label: "B", text: "Sum = 1, Carry-out = 0" },
            { label: "C", text: "Sum = 1, Carry-out = 1" },
            { label: "D", text: "Sum = 1, Carry-out = 2" }
        ],
        answer: "C"
    },
    {
        id: 12,
        lane: 4,
        difficulty: "Hard",
        type: "multiple-choice",
        question: "Evaluate the Boolean expression (A + B') · (B + C) when A = 0, B = 1, and C = 1.",
        choices: [
            { label: "A", text: "0" },
            { label: "B", text: "1" },
            { label: "C", text: "2" }
        ],
        answer: "A"
    },
    // Lane 5: Multi-Step Circuit Analysis and Combined Adders
    {
        id: 13,
        lane: 5,
        difficulty: "Very Hard",
        type: "multiple-choice",
        question: "Two 2-bit binary numbers, 11 and 11, are added using a half-adder and a full-adder. What is the final 3-bit result?",
        choices: [
            { label: "A", text: "101" },
            { label: "B", text: "110" },
            { label: "C", text: "100" }
        ],
        answer: "B"
    },
    {
        id: 14,
        lane: 5,
        difficulty: "Very Hard",
        type: "multiple-choice",
        question: "Evaluate the Boolean expression (A + B)' + (A · C) when A = 0, B = 0, and C = 1.",
        choices: [
            { label: "A", text: "0" },
            { label: "B", text: "1" },
            { label: "C", text: "2" }
        ],
        answer: "B"
    },
    {
        id: 15,
        lane: 5,
        difficulty: "Very Hard",
        type: "multiple-choice",
        question: "Which Boolean expression correctly represents the Carry-out (Cout) of a full-adder?",
        choices: [
            { label: "A", text: "A ⊕ B ⊕ Cin" },
            { label: "B", text: "A · B · Cin" },
            { label: "C", text: "(A · B) + (Cin · (A ⊕ B))" }
        ],
        answer: "C"
    }
];

// Redemption Question
window.redemptionQuestion = {
    id: "redemption",
    type: "multiple-choice",
    question: "Convert the sum of the following two binary numbers into base 10: A = 1000000 and B = 0000011.",
    choices: [
        { label: "A", text: "6006" },
        { label: "B", text: "69" },
        { label: "C", text: "67" },
        { label: "D", text: "3501" }
    ],
    answer: "C"
};

window.LANES = [
{ name:"Lane 1 – Very Easy", sub:"Basic logic gates and simple outputs", qs:[
{ t:"circuit", gate:"AND", initial:[0,0], target:1, q:"Traffic signal challenge: Set A and B so the AND circuit outputs 1 and opens the road.", why:"AND outputs 1 only when A = 1 and B = 1." },
{ t:"mc", q:"A NOT gate receives an input of 1. What is the output?", o:["0","1","2"], a:0, why:"NOT inverts its input, so NOT 1 = 0." },
{ t:"mc", q:"A half-adder receives A = 0 and B = 1. What are its Sum and C-out outputs?", o:["Sum = 0, Carry = 1","Sum = 1, Carry = 1","Sum = 1, Carry = 0"], a:2, why:"Sum = A ⊕ B = 1 and Carry = A · B = 0." }
]},
{ name:"Lane 2 – Easy", sub:"Binary numbers and 2-input truth tables", qs:[
{ t:"mc", q:"An XOR gate receives 6-bit inputs A = 101001 and B = 100101. What is the output?", o:["101001","001100","110010","001110"], a:1, why:"XOR bit by bit: 101001 ⊕ 100101 = 001100." },
{ t:"circuit", gate:"OR", initial:[0,0], target:1, q:"Road barrier challenge: Set the OR gate inputs to output 1 and lift the barrier.", why:"OR outputs 1 when at least one input is 1." },
{ t:"mc", q:"A half adder receives inputs A = 1 and B = 1. What are its Sum and C-out outputs?", o:["Sum = 0, C-out = 1","Sum = 1, C-out = 0","Sum = 1, C-out = 1","Sum = 0, C-out = 0"], a:0, why:"1 + 1 = 10 in binary: Sum = 0, carry = 1." }
]}
];