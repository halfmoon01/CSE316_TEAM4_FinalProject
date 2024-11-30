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
      if (id !== null) {
        try {
          const response = await fetch(`http://localhost:8080/members/${id}`);
          if (response.ok) {
            const data = await response.json();
            setMembers(data.memberList); 
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

  if (isLoading) {
    return <h1>Loading...</h1>;
  }

  if (isExecutives <= 0 || !isLoggedIn) {
    return <h1>No Permission!</h1>;
  }

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

    try {
      //1. bring information 
      const response = await fetch(
        `http://localhost:8080/manage-account/members/${memberId}`);
      if(!response.ok){
        const error = await response.json();
        alert(error.message || "Failed to fetch member information.");
        return;
      }
      const currentMember = await response.json(); // current poeple information
      // 2. if it is has higher or same isExecutives level than the logged in person -> reject
      if (currentMember.isExecutives >= isExecutives) {
        alert("You can only modify the position of someone with the lower rank than you.");
        return;
      }
      // 3. Member(0) → Chief Executive(2) reject 
      // member cannot be Cheif Executive right away 
      if (currentMember.isExecutives === 0 && newIsExecutive === 2) {
        alert("Cannot change directly from Member to Chief Executive.");
        return;
      }
      // 4. send to server
      const updateResponse = await fetch(
        `http://localhost:8080/manage-account/members/${memberId}/position`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ position: newPosition, isExecutive: newIsExecutive }),
      });
      const responseData = await updateResponse.json();
  
      if (!updateResponse.ok) {
        alert(responseData.message || "Failed to update position.");
        return;
      }
  
      // 5. if the logged in member has been downgraded -> alert
      if (responseData.downgraded && responseData.downgraded.id === id) {
        alert("You have been demoted to Executive Manager.");
      }
      alert(`Position updated to "${newPosition}"`);
      window.location.reload();
    } catch (error) {
      console.error("Error updating position:", error);
      alert("An error occurred while updating the position.");
    }
  };

  const handleRemove = async (memberId) => {
    try {
      const response = await fetch(`http://localhost:8080/members/${memberId}`, {
        method: 'DELETE',
      });
  
      if (response.ok) {
        setMembers((prevMembers) =>
          prevMembers.filter((member) => member.id !== memberId)
        );
        alert('This member has been removed.');
      } else {
        const errorData = await response.json();
        console.error('Failed to remove member:', errorData.message);
        alert(errorData.message || 'Failed to remove member.');
      }
    } catch (error) {
      console.error('Error removing member:', error);
      alert('An error occurred while trying to remove the member.');
    }
  };
  
  
  return (
    <>
    <div className="myinfo-heading">
          <h1 className="myInfo-title">Manage Accounts</h1>
          <hr />
      </div>
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
