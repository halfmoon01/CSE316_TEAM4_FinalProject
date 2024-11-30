import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create a context to manage authentication information
const AuthInformation = createContext();

export const AuthTracker = ({ children }) => {
  // States to manage user authentication and information

  // Tracks if the user is logged in
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Tracks if the authentication check is ongoing
  const [isLoading, setIsLoading] = useState(true);

  // User ID
  const [id, setId] = useState(null);

  // Member ID
  const [memberId, setMemberId] = useState(null);

  // User email
  const [email, setEmail] = useState(null);

  // User name
  const [name, setName] = useState(null);

  // User phone number
  const [phoneNumber, setPhoneNumber] = useState(null);

  // Default profile image URL
  const [profileImageUrl, setProfileImageUrl] = useState("./user.png");

  // User position
  const [position, setPosition] = useState(null);

  // User's executive status(0 or 1)
  const [isExecutives, setIsExecutives] = useState(null);

  // Check login status and fetch user data when the component mounts
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Check if the user is logged in
        const loginResponse = await axios.get(
          "http://localhost:8080/api/login-track",
          { withCredentials: true } // Include credentials for secure communication
        );

        const loggedIn = loginResponse.data.loggedIn;
        const userId = loginResponse.data.id;

        if (loggedIn && userId) {
          // Fetch user information if logged in
          const memberResponse = await axios.get(
            "http://localhost:8080/api/get-member-info",
            {
              params: { id: userId }, // Send user ID as a parameter
              withCredentials: true, // Include credentials
            }
          );

          const info = memberResponse.data.memberInfo;

          // Update user data states
          setIsLoggedIn(true);
          setId(userId);
          setMemberId(info.memberId);
          setEmail(info.email);
          setName(info.name);
          setPhoneNumber(info.phoneNumber);
          if (info.profileImageUrl) {
            setProfileImageUrl(info.profileImageUrl);
          }
          setPosition(info.position);
          setIsExecutives(info.isExecutives);
        } else {
          // If not logged in, reset to default states
          setIsLoggedIn(false);
          setProfileImageUrl("./user.png");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      } finally {
        setIsLoading(false); // 로딩 상태 종료
      }
    };

    checkLoginStatus();
  }, []); // Runs once when the component mounts

  // Logout function to clear user authentication and information
  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/logout",
        {},
        { withCredentials: true } // Include credentials
      );

      // Reset all user-related states
      setIsLoggedIn(false);
      setIsExecutives(0);
      setId(null);
      setMemberId(null);
      setEmail(null);
      setName(null);
      setPhoneNumber(null);
      setProfileImageUrl("./user.png");
      setPosition(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return (
    <AuthInformation.Provider
      value={{
        id,
        isLoggedIn,
        setIsLoggedIn,
        isLoading,
        setIsLoading,
        memberId,
        email,
        setEmail,
        name,
        setName,
        phoneNumber,
        setPhoneNumber,
        profileImageUrl,
        setProfileImageUrl,
        position,
        setPosition,
        logout,
        isExecutives,
        setIsExecutives,
      }}
    >
      {children}
    </AuthInformation.Provider>
  );
};

// Custom hook to access authentication context
export const checkAuth = () => useContext(AuthInformation);
