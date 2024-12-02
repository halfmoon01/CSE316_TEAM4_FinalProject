import { useState, useEffect, useRef } from "react";
import "@/css_files/ManageAccounts.css";
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
  ]); // Predefined positions

  const { id, isExecutives, isLoading, isLoggedIn } = checkAuth();
  const navigate = useNavigate();

  // Ref to prevent multiple alerts
  const alerted = useRef(false);

  // State to track if the alert has been shown
  const [showAlert, setShowAlert] = useState(false);
  const [isAltered, setIsAltered] = useState(false);


  // Set the page title
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
  }, [id, isAltered]);

  // Navigates unauthenticated users
  useEffect(() => {
    if (!isLoading && !isLoggedIn && !alerted.current) {
      alerted.current = true;
      alert(
        "You have to sign in first in order to access the page!\nNavigating..."
      );
      navigate("/LogIn");
    }
  }, [isLoading, isLoggedIn, navigate]);

  // Navigates non-executive users to the home screen
  useEffect(() => {
    if (!isLoading && isLoggedIn && isExecutives <= 0 && !alerted.current) {
      alerted.current = true;
      alert(
        "Only executives can access this page!\nNavigating to the Home Screen..."
      );
      navigate("/HomeScreen");
    }
  }, [isLoading, isLoggedIn, isExecutives, navigate]);

  // Show the alert after the page has loaded
  useEffect(() => {
    if (!isLoading && isLoggedIn && isExecutives > 0) {
      setShowAlert(true); // Trigger the alert once after the page loads
    }
  }, [isLoading, isLoggedIn, isExecutives]);

  // Display alert after rendering if `showAlert` is true
  useEffect(() => {
    if (showAlert) {
      alert(
        "Pressing the 'Remove' button or altering a member's role will immediately be updated to the database without additional confirmation."
      );
    }
  }, [showAlert]);

  // Show loading screen or deny access if conditions are not met
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
        alert("Cannot change directly from Non-Executive to Chief Executive Manager.");
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
      setIsAltered(!isAltered);
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
        setIsAltered(!isAltered);
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
    {/* Page Heading */}
    <div className="myinfo-heading">
          <h1 className="myInfo-title">Manage Accounts</h1>
          <hr />
      </div>
      <div className="members-container">
        {members.map((member) => (
          <div className="member-card" key={member.id}>
            <div className="member-image">
              <img src={member.profileImageUrl || "/user.png"} alt="Member" />
            </div>
            {/* Member Details */}
            <div className="member-content">
              <p>Name: {member.name}</p>
              <p>ID: {member.memberId}</p>
              <p>Email: {member.email}</p>
              <p>Phone-number: {member.phoneNumber}</p>
              {/* Position Selector */}
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
