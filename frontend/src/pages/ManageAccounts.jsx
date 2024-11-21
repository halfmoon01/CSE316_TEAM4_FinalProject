import { useState, useEffect, useRef } from "react";
import "@/css_files/ManageAccounts.css";
import UserIcon from "../../public/user.png";
import { checkAuth } from "../AuthTracker";
import { useNavigate } from "react-router-dom";

const Members = () => {
  const [members, setMembers] = useState([]);
  const [positions] = useState([
    "Executive Manager",
    "Chief Executive Manager",
    "Treasurer",
    "Advisor",
    "Member",
  ]);

  const { id, isExecutives, isLoading, isLoggedIn } = checkAuth();
  const navigate = useNavigate();
  const alerted = useRef(false);

  useEffect(() => {
    document.title = "Members Page";

    const fetchMembers = async () => {
      console.log(id);
      if (id !== null) {
        try {
          const response = await fetch(`http://localhost:8080/members/${id}`);
          if (response.ok) {
            const data = await response.json(); // 응답 JSON 파싱
            console.log(data.memberList);
            setMembers(data.memberList); // 서버의 memberList를 상태로 설정
          } else {
            console.error("Failed to fetch members.");
          }
        } catch (error) {
          console.error("Error fetching members:", error);
        }
      }
    };

    fetchMembers();
  }, [id]);

  useEffect(() => {
    if (!isLoading && !isLoggedIn && !alerted.current) {
      alerted.current = true;
      alert(
        "You have to sign in first in order to access the page!\nNavigating to the Login Page..."
      );
      navigate("/LogIn");
    }
  }, [isLoading, isLoggedIn, navigate]);

  useEffect(() => {
    if (!isLoading && isLoggedIn && isExecutives <= 0 && !alerted.current) {
      alerted.current = true;
      alert(
        "Only executives can access this page!\nNavigating to the Home Screen..."
      );
      navigate("/HomeScreen");
    }
  }, [isLoading, isLoggedIn, isExecutives, navigate]);

  if (isExecutives <= 0 || !isLoggedIn) {
    return <h1>No Permission!</h1>;
  }

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  const handleRemove = async (id) => {
    try {
      const response = await fetch(`http://localhost:8080/members/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        setMembers((prevMembers) =>
          prevMembers.filter((member) => member.id !== id)
        );
        alert("Member has been removed.");
      } else {
        const errorData = await response.json();
        console.error("Failed to remove member:", errorData.message);
        alert("Failed to remove member.");
      }
    } catch (error) {
      console.error("Error removing member:", error);
      alert("An error occurred while trying to remove the member.");
    }
  };

  const getIsExecutiveValue = (position) => {
    switch (position) {
      case "Chief Executive Manager":
        return 2;
      case "Executive Manager":
        return 1;
      default:
        return 0;
    }
  };

  const handlePositionChange = async (memberId, newPosition) => {
    const newIsExecutive = getIsExecutiveValue(newPosition);

    // Accept only one Chief Executive Manager
    const existingChief = members.find((member) => member.isExecutive === 2);
    if (
      newIsExecutive === 2 &&
      existingChief &&
      existingChief.id !== memberId
    ) {
      alert("There can only be one Chief Executive Manager.");
      return;
    }

    // Do not allow to modify logged in person's info
    if (id === memberId) {
      alert("You cannot modify your own position.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:8080/members/${memberId}/position`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            position: newPosition,
            isExecutive: newIsExecutive,
          }),
        }
      );

      if (response.ok) {
        setMembers((prevMembers) =>
          prevMembers.map((member) =>
            member.id === memberId
              ? {
                  ...member,
                  position: newPosition,
                  isExecutive: newIsExecutive,
                }
              : member
          )
        );
        alert(`Position updated to "${newPosition}"`);
      } else {
        const errorData = await response.json();
        alert(errorData.message || "Failed to update position.");
      }
    } catch (error) {
      console.error("Error updating position:", error);
      alert("An error occurred while updating the position.");
    }
  };

  return (
    <>
      <div className="members-container">
        {members.map((member) => (
          <div className="member-card" key={member.id}>
            <div className="member-image">
              <img src={member.profileImageUrl || UserIcon} alt="Member" />
            </div>
            <div className="member-content">
              <p>Name: {member.name}</p>
              <p>ID: {member.memberId}</p>
              <p>Email: {member.email}</p>
              <p>Phone-number: {member.phoneNumber}</p>
              <div className="position-selector">
                <p>Position:</p>
                <select
                  className="select"
                  value={member.position || "No position assigned"}
                  onChange={(e) =>
                    handlePositionChange(member.id, e.target.value)
                  }
                >
                  {positions.map((position) => (
                    <option key={position} value={position}>
                      {position}
                    </option>
                  ))}
                </select>
              </div>

              <button
                className="remove-account-button"
                onClick={() => handleRemove(member.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Members;
