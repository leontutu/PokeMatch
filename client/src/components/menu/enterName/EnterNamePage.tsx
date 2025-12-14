import { useState, useEffect } from "react";
import { useSocketContext } from "../../../contexts/SocketContext";
import { Pages } from "../../../constants/constants";
import { isValidName } from "../../../../../shared/utils/validation";
import HomeLayout from "../layout/HomeLayout";
import NameInput from "./NameInput";
import SubmitButton from "./SubmitButton";
import styles from "./EnterNamePage.module.scss";
import { useNavigationContext } from "../../../contexts/NavigationContext";
import { UI_TEXT } from "../../../constants/uiText";
import { SFX_IDS, useAudioStore } from "../../../stores/useAudioStore";

/**
 * Renders the UI for entering a player's name before joining a room.
 *
 * This component manages the state for the name input and its validation.
 * It interacts with the socket context to submit the name to the server.
 * Based on the server's response, it will either navigate the user to the
 * game room or display an error and return them to the home page.
 *
 * @example
 * <EnterNamePage />
 */
export default function EnterNamePage() {
  const {
    sendName,
    hasPassedValidNameCheck,
    setHasPassedValidNameCheck,
    nameErrorSignal,
    setNameErrorSignal,
  } = useSocketContext();
  const { handleNavigate } = useNavigationContext();
  const [name, setName] = useState("");
  const [isNameValid, setIsNameValid] = useState(false);
  const playSfx = useAudioStore((state) => state.playSfx);

  useEffect(() => {
    // Note: This should rarely happen, as name validation is already performed client-side.
    if (nameErrorSignal) {
      handleNavigate(Pages.HOME);
      setNameErrorSignal(false);
      alert(UI_TEXT.ALERTS.INVALID_NAME);
    }
  }, [nameErrorSignal, handleNavigate, setNameErrorSignal]);

  useEffect(() => {
    if (hasPassedValidNameCheck) {
      handleNavigate(Pages.ROOM_OPTIONS, false);
      setHasPassedValidNameCheck(false);
    }
  }, [hasPassedValidNameCheck, handleNavigate]);

  function handleSubmit() {
    if (!isValidName(name)) {
      return;
    }
    sendName(name);
    playSfx(SFX_IDS.MENU_BLIP_2);
  }

  return (
    <HomeLayout>
      <div className={styles.inputSection}>
        <div className={styles.mainContent}>
          <NameInput
            name={name}
            setName={setName}
            isNameValid={isNameValid}
            setIsNameValid={setIsNameValid}
          />
        </div>
        <SubmitButton isNameValid={isNameValid} handleSubmit={handleSubmit} />
      </div>
    </HomeLayout>
  );
}
