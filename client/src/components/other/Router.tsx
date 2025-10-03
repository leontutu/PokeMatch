import { Pages } from "../../constants/constants";
import BattlePage from "../match/battle/BattlePage";
import PokemonRevealPage from "../match/reveal/PokemonRevealPage";
import SelectStatPage from "../match/SelectStat/SelectStatPage";
import VictoryPage from "../match/victory/VictoryPage";
import EnterNamePage from "../menu/enterName/EnterNamePage";
import HomePage from "../menu/home/HomePage";
import RoomPage from "../menu/room/RoomPage";

type RouterProps = {
    page: Pages;
};

export default function Router({ page }: RouterProps) {
    switch (page) {
        case Pages.HOME:
            return <HomePage />;
        case Pages.ENTER_NAME:
            return <EnterNamePage />;
        case Pages.ROOM:
            return <RoomPage />;
        case Pages.SELECT_STAT:
            return <SelectStatPage />;
        case Pages.BATTLE:
            return <BattlePage />;
        case Pages.VICTORY:
            return <VictoryPage />;
        case Pages.POKEMON_REVEAL:
            return <PokemonRevealPage />;
        default:
            return <HomePage />;
    }
}
