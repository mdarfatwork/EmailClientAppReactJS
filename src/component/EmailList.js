import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { readMail, bodyMail } from "../redux/mailSlice";
import EmailDetails from "./EmailDetails";

const EmailList = () => {
  const [emails, setEmails] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEmail, setSelectedEmail] = useState(null);
  const [filter, setFilter] = useState('all');
  const readMails = useSelector(state => state.readMail);
  const favoriteMails = useSelector(state => state.favoriteMail);
  const dispatch = useDispatch();

  useEffect(() => {
    fetch("https://flipkart-email-mock.vercel.app/")
      .then(response => response.json())
      .then(data => {
        setEmails(data.list);
        setIsLoading(false);
      })
      .catch(error => {
        console.error("Error fetching data:", error);
        setIsLoading(true);
      });
  }, []);

  const formatDate = dateString => {
    const options = {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const handleEmailClick = email => {
    setSelectedEmail(email);
    dispatch(readMail(email.id));
    const emaildata = {
      id: email.id,
      name: email.from.name,
      date: email.date,
    };
    dispatch(bodyMail(emaildata));
  };

  const emailContainerClass = email =>
    `border-2 rounded-lg px-3 py-3 lg:px-5 flex gap-2 lg:gap-4 ${
      selectedEmail === email ? "border-[#E54065]" : "border-[#CFD2DC]"
    }`;

  const emailBackgroundStyle = email => ({
    background: readMails.some(mail => mail.mailId === email.id) ? "#F2F2F2" : "transparent",
  });

  const handleFilter = selectedFilter => {
    setFilter(selectedFilter);
  };

  const filteredEmails = emails.filter(email => {
    if (filter === 'unread') {
      return !readMails.some(mail => mail.mailId === email.id);
    } else if (filter === 'read') {
      return readMails.some(mail => mail.mailId === email.id);
    } else if (filter === 'favorite') {
      return favoriteMails.some(mail => mail.mailId === email.id);
    }
    return true; // 'all' filter or default
  });

  return (
    <div>
      {/* Navbar */}
      <nav>
        <ul className="text-black flex items-center gap-3 text-lg">
          <li>Filter By:&nbsp;&nbsp;&nbsp;</li>
          <li onClick={() => handleFilter('unread')} className={`... ${filter === 'unread' ? 'bg-[#F2F2F2] text-[#717171] rounded-full px-3 border-2 border-[#CFD2DC]' : ''}`}>Unread</li>
          <li onClick={() => handleFilter('read')} className={`... ${filter === 'read' ? 'bg-[#F2F2F2] text-[#717171] rounded-full px-3 border-2 border-[#CFD2DC]' : ''}`}>Read</li>
          <li onClick={() => handleFilter('favorite')} className={`... ${filter === 'favorite' ? 'bg-[#F2F2F2] text-[#717171] rounded-full px-3 border-2 border-[#CFD2DC]' : ''}`}>Favorites</li>
        </ul>
      </nav>
      <main className="w-full flex mt-5 lg:mt-8">
        <aside className={`border-0 w-full ${selectedEmail ? "lg:w-[30%]" : "md:w-full"}`}>
          {isLoading ? (
            <p>Loading...</p>
          ) : (
            <div className="flex flex-col gap-3 lg:gap-5">
              {filteredEmails.length ? (
                filteredEmails.map(email => (
                  <div
                    className={emailContainerClass(email)}
                    key={email.id}
                    onClick={() => handleEmailClick(email)}
                    style={emailBackgroundStyle(email)}
                  >
                                        <div className="w-1/12">
                      <div className="w-10 h-10 bg-[#E54065] text-white flex items-center justify-center rounded-full text-lg font-semibold">
                        {email.from.name.charAt(0).toUpperCase()}
                      </div>
                    </div>
                    <div className="w-11/12">
                      <p>
                        From:{" "}
                        <span className="font-bold">
                          {`${email.from.name} ${email.from.email}`}
                        </span>
                      </p>
                      <p>
                        Subject: <span className="font-bold">{email.subject}</span>
                      </p>
                      <p className="my-2 lg:my-3" style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {email.short_description}
                      </p>
                      <p className="flex gap-5">
                        <span>{formatDate(email.date)}</span>
                        {favoriteMails.some((mail) => mail.mailId === email.id) && (
                          <span className="text-[#E54065] font-semibold">Favorite</span>
                        )}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <p>No emails to display.</p>
              )}
            </div>
          )}
        </aside>
        <EmailDetails />
      </main>
    </div>
  );
};

export default EmailList;
