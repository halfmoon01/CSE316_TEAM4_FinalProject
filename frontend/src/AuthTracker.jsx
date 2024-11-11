import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AuthInformation = createContext();

export const AuthTracker = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [id, setId] = useState(null);
  const [memberId, setMemberId] = useState(null);
  const [email, setEmail] = useState(null);
  const [name, setName] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [profileImageUrl, setProfileImageUrl] = useState('./user.png');
  const [position, setPosition] = useState(null);
  const [isExecutives, setIsExecutives] = useState(null);

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const loginResponse = await axios.get(
          "http://localhost:8080/api/login-track",
          { withCredentials: true }
        );

        const loggedIn = loginResponse.data.loggedIn;
        const userId = loginResponse.data.id;

        if (loggedIn && userId) {
          const memberResponse = await axios.get(
            "http://localhost:8080/api/get-member-info",
            {
              params: { id: userId }, // 요청 데이터로 id 전달
              withCredentials: true, // 쿠키 포함
            }
          );

          const info = memberResponse.data.memberInfo;

          // 데이터 수집 후 상태를 한 번에 업데이트
          setIsLoggedIn(true);
          setId(userId);
          setMemberId(info.memberId);
          setEmail(info.email);
          setName(info.name);
          setPhoneNumber(info.phoneNumber);
          // setProfileImageUrl(info.profileImageUrl || "./user.png"); // 기본 이미지 적용
          if(info.profileImageUrl){
            setProfileImageUrl(info.profileImageUrl);
          }
          setPosition(info.position);
          setIsExecutives(info.isExecutives);
        } else {
          // 로그인 상태가 아니면 기본값 설정
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
  }, []); // 의존성 배열은 비움

  const logout = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/logout",
        {},
        { withCredentials: true }
      );

      // 상태 초기화
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

export const checkAuth = () => useContext(AuthInformation);
