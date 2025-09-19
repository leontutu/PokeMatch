import { NavigationHandler } from "../../../types";
import MatchLayout from "../layout/MatchLayout";

type PokemonRevealPageProps = {
    onNavigate: NavigationHandler;
};

export default function PokemonRevealPage({ onNavigate }: PokemonRevealPageProps) {
        return (
            <MatchLayout onNavigate={onNavigate}>
               <p> Hello World!</p> 
            </MatchLayout>
        );
}