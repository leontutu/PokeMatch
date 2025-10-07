import instruction1 from "../assets/graphics/instruction/instruction-1.png";
import instruction2 from "../assets/graphics/instruction/instruction-2.png";
import instruction3 from "../assets/graphics/instruction/instruction-3.png";

export const instructionData = [
    {
        instructionHeader: "GET POKEMON",
        instructionImage: instruction1,
        instructions: [
            "Once the game starts, you will be given a random Pokemon",
            "This is your Pokemon for this Match",
            "One Match lasts three Rounds",
            "After 3 Rounds a new Match with new Pokemon begins!",
        ],
    },
    {
        instructionHeader: "CHOOSE STAT",
        instructionImage: instruction2,
        instructions: [
            "Which of your Stats is likely to be higher than the same stat of your opponent?",
            "Stats selected by either you or your opponent previously are locked",
            "Select your Stat and lock it in by pressing the Choose! Button",
        ],
    },
    {
        instructionHeader: "TO BATTLE",
        instructionImage: instruction3,
        instructions: [
            "Sit back and watch the Battle unfold!",
            "A won battle awards points equal to the current round",
            "So you don't want to use your best stats right away",
            "Reach 20 Points to win the game!",
        ],
    },
];
