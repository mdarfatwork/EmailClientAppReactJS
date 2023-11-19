import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { favoriteMail, bodyMail } from "../redux/mailSlice";

const EmailDetails = () => {
  const [isEmailDetailsVisible, setEmailDetailsVisible] = useState(true);
  const dispatch = useDispatch();
  const selectedEmail = useSelector((state) => state.bodyMail[0]);
  const [emailBody, setEmailBody] = useState(null);

  useEffect(() => {
    const fetchEmailBody = async () => {
      try {
        const response = await fetch(`https://flipkart-email-mock.now.sh/?id=${selectedEmail?.mailId.id}`);
        const data = await response.json();
        setEmailBody(data);
        setEmailDetailsVisible(prevState => !prevState);
      } catch (error) {
        console.error("Error fetching email body:", error);
      }
    };

    if (selectedEmail) {
      fetchEmailBody();
    }
  }, [selectedEmail]);

  const formatDate = (dateString) => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const toggleEmailDetails = () => {
    setEmailDetailsVisible(!isEmailDetailsVisible);
  };

  const renderEmailBody = () => {
    if (!emailBody || !emailBody.body) {
      return <p>No email content available.</p>;
    }
  
    const paragraphs = emailBody.body.split("</p>");
  
    return (
      <div>
        {paragraphs.map((paragraph, index) => (
          <div key={index}>
            <p dangerouslySetInnerHTML={{ __html: paragraph + "</p>" }} />
            {index < paragraphs.length - 1 && <br />}
          </div>
        ))}
      </div>
    );
  };  

  if (!selectedEmail) {
    return null;
  }

  return (
    <section className={`bg-white absolute border-2 rounded-lg p-4 right-2 ml-2 lg:fixed lg:ml-0 lg:right-10 lg:p-8 lg:gap-6 lg:min-h-[85vh] lg:w-[65%] ${isEmailDetailsVisible ? "" : "hidden"}`}>
      <span className="block lg:hidden w-6 h-6 mb-5" onClick={toggleEmailDetails}>
        <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h48v48H0z" fill="none" />
          <g id="Shopicon">
            <polygon points="22,40 22,26 40,26 40,22 22,22 22,8 6,24 " />
          </g>
        </svg>
      </span>
      <article className="lg:w-full lg:flex">
        <section className="lg:w-1/12">
          <div className="w-14 h-14 bg-[#E54065] text-white flex items-center justify-center rounded-full text-xl font-semibold">
            {selectedEmail?.mailId?.name?.toUpperCase()?.charAt(0)}
          </div>
        </section>
        <section className="lg:w-11/12">
          <div className="flex flex-col gap-4 w-full mt-3 lg:mt-0">
            <div className="flex justify-between">
              <h1 className="text-3xl font-bold">{selectedEmail.mailId.name}</h1>
              <span onClick={() => dispatch(favoriteMail(selectedEmail.mailId.id))} className="text-white h-min py-2 text-xs rounded-full bg-[#E54065] flex justify-center items-center px-5 font-bold">
                Mark as Favorite
              </span>
            </div>
            <p>{formatDate(selectedEmail.mailId.date)}</p>
            {renderEmailBody()}
          </div>
        </section>
      </article>
    </section>
  );
};

export default EmailDetails;
