"use client"; // Mark this component as a Client Component

import { useEffect, useState } from "react";

const AnnouncementManager = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentItem, setCurrentItem] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [imageurl, setImageurl] = useState("");
  const [date, setDate] = useState("");
  const [link, setLink] = useState("");
  const [message, setMessage] = useState("");

  // Fetch announcements on component mount
  useEffect(() => {
    const fetchData = async () => {
      const announcementResponse = await fetch("/api/announcements", {
        method: "GET",
      });
      const announcementData = await announcementResponse.json();
      setAnnouncements(announcementData.data);
    };

    fetchData();
  }, []);

  // Open modal for creating a new announcement
  const handleCreateNewItem = () => {
    setIsEdit(false);
    setModalOpen(true);
    resetForm();
  };

  // Open modal for editing an announcement
  const handleEditItem = (item) => {
    setIsEdit(true);
    setModalOpen(true);
    setCurrentItem(item);
    setTitle(item.title);
    setDescription(item.description);
    setImageurl(item.imageurl || "");
    setDate(item.date);
    setLink(item.link || "");
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setImageurl("");
    setDate("");
    setLink("");
  };

  // Handle announcement deletion
  const handleDeleteItem = async (item) => {
    const payload = { id: item._id }; // Send the ID in the payload
    const response = await fetch("/api/announcements", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setAnnouncements(announcements.filter((a) => a._id !== item._id));
    } else {
      setMessage("Failed to delete item");
    }
  };

  // Handle form submission for creating/editing announcements
  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { title, description, date, link }; // Include the date field
  
    if (isEdit) {
      payload.id = currentItem._id; // Include ID in payload for editing
    }
  
    try {
      const method = isEdit ? 'PUT' : 'POST';
      const response = await fetch('/api/announcements', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
  
      const data = await response.json();
      if (response.ok) {
        setMessage(data.message);
        setModalOpen(false);
  
        // Update the announcements state
        const updatedAnnouncements = isEdit
          ? announcements.map((announcement) => (announcement._id === currentItem._id ? { ...announcement, ...payload } : announcement))
          : [...announcements, data.announcement];
  
        setAnnouncements(updatedAnnouncements);
        resetForm();
      } else {
        setMessage(data.message || 'Failed to create/edit announcement');
      }
    } catch (error) {
      setMessage('An error occurred while creating/editing the announcement');
    }
  };
  

  return (
    <div className="p-4">
      <button
        onClick={handleCreateNewItem}
        className="bg-green-500 text-white py-2 px-4 rounded mb-4"
      >
        Create New Announcement
      </button>

      <div>
        <h2 className="text-xl font-semibold mb-4">Announcement List</h2>
        {announcements.length > 0 ? (
          announcements.map((announcement) => (
            <div
              key={announcement._id}
              className="border p-4 rounded-lg shadow-md mb-4"
            >
              <h3 className="text-lg font-bold">{announcement.title}</h3>
              <p>{announcement.description}</p>
              <p className="text-sm text-gray-500">
                {new Date(announcement.date).toLocaleDateString()}
              </p>
              <a
                href={announcement.link}
                className="text-blue-500"
                target="_blank"
                rel="noopener noreferrer"
              >
                View Link
              </a>
              <div className="mt-2">
                <button
                  onClick={() => handleEditItem(announcement)}
                  className="bg-yellow-500 text-white py-1 px-2 rounded mr-2"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteItem(announcement)}
                  className="bg-red-500 text-white py-1 px-2 rounded"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <p>No announcements found.</p>
        )}
      </div>

      {/* Modal for creating/editing announcements */}
      {modalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/3">
            <h2 className="text-xl font-semibold mb-4">
              {isEdit ? "Edit Announcement" : "Create Announcement"}
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block mb-1">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  className="border rounded p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="border rounded p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="date" className="block mb-1">
                  Date
                </label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="border rounded p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="link" className="block mb-1">
                  Link
                </label>
                <input
                  type="url"
                  id="link"
                  value={link}
                  onChange={(e) => setLink(e.target.value)}
                  required
                  className="border rounded p-2 w-full"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded w-full"
              >
                {isEdit ? "Update" : "Create"}
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="bg-gray-300 text-black py-2 px-4 rounded mt-2 w-full"
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {message && <p className="text-red-500 mt-4">{message}</p>}
    </div>
  );
};

export default AnnouncementManager;
