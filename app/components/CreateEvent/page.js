"use client"; 

import { useEffect, useState } from 'react';

const EventManager = () => {
  const [events, setEvents] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageurl, setImageurl] = useState('');
  const [date, setDate] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchEvents = async () => {
      const response = await fetch('/api/events', {
        method: 'GET', 
      });
      const { data } = await response.json();
      setEvents(data);
    };

    fetchEvents();
  }, []);

  const handleCreateNewEvent = () => {
    setIsEdit(false);
    setModalOpen(true);
    setTitle('');
    setDescription('');
    setImageurl('');
    setDate('');
  };

  const handleEditEvent = (event) => {
    setIsEdit(true);
    setModalOpen(true);
    setCurrentEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setImageurl(event.imageurl);
  
    const formattedDate = new Date(event.date).toISOString().split('T')[0];
    setDate(formattedDate);
  };

  const handleDeleteEvent = async (event) => {
    const payload = { id: event._id }; 
    const response = await fetch('/api/events', {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      setEvents(events.filter((e) => e._id !== event._id));
    } else {
      setMessage('Failed to delete event');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { title, description, imageurl, date };

    if (isEdit) {
      payload.id = currentEvent._id; 
    }

    try {
      const method = isEdit ? 'PUT' : 'POST';
      const response = await fetch('/api/events', {
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
        const updatedEvents = isEdit
          ? events.map((event) => (event._id === currentEvent._id ? { ...event, ...payload } : event))
          : [...events, data.event];

        setEvents(updatedEvents);
        setTitle('');
        setDescription('');
        setImageurl('');
        setDate('');
      } else {
        setMessage(data.message || 'Failed to create/edit event');
      }
    } catch (error) {
      setMessage('An error occurred while creating/editing the event');
    }
  };

  return (
    <div className="p-4">
      <button
        onClick={handleCreateNewEvent}
        className="bg-blue-500 text-white py-2 px-4 rounded mb-4"
      >
        Create New Event
      </button>

      <div>
        <h2 className="text-xl font-semibold mb-4">Event List</h2>
        {events.length > 0 ? (
          events.map((event) => (
            <div key={event._id} className="border p-4 rounded-lg shadow-md mb-4 flex items-center">
              <img src={event.imageurl} alt={event.title} className="w-16 h-16 object-cover mr-4" />
              <div className="flex-1">
                <h3 className="text-lg font-bold">{event.title}</h3>
                <p>{event.description}</p>
                <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString()}</p>
              </div>
              <button
                onClick={() => handleEditEvent(event)}
                className="bg-yellow-500 text-white py-1 px-2 rounded mr-2"
              >
                Edit
              </button>
              <button
                onClick={() => handleDeleteEvent(event)}
                className="bg-red-500 text-white py-1 px-2 rounded"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>Loading events...</p>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-11/12 md:w-1/3">
            <h2 className="text-xl font-semibold mb-4">{isEdit ? 'Edit Event' : 'Create Event'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block mb-1">Title</label>
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
                <label htmlFor="description" className="block mb-1">Description</label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  className="border rounded p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="imageurl" className="block mb-1">Image URL</label>
                <input
                  type="url"
                  id="imageurl"
                  value={imageurl}
                  onChange={(e) => setImageurl(e.target.value)}
                  required
                  className="border rounded p-2 w-full"
                />
              </div>
              <div className="mb-4">
                <label htmlFor="date" className="block mb-1">Date</label>
                <input
                  type="date"
                  id="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="border rounded p-2 w-full"
                />
              </div>
              <button
                type="submit"
                className="bg-blue-500 text-white py-2 px-4 rounded"
              >
                {isEdit ? 'Update Event' : 'Create Event'}
              </button>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="bg-gray-300 text-black py-2 px-4 rounded ml-2"
              >
                Cancel
              </button>
            </form>
            {message && <p className="mt-4 text-red-600">{message}</p>}
          </div>
        </div>
      )}
    </div>
  );
};

export default EventManager;
