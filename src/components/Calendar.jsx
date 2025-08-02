import React, { useState } from 'react';
import './Calendar.css';

const Calendar = () => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay(); // 0 (Sun) to 6 (Sat)
  };

  const prevMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstDayIndex = getFirstDayOfMonth(year, month);

  const today = new Date();
  const isCurrentMonth = today.getFullYear() === year && today.getMonth() === month;

  const days = [];

  for (let i = 0; i < firstDayIndex; i++) {
    days.push(<span key={`empty-${i}`} className="empty"></span>);
  }

  for (let d = 1; d <= daysInMonth; d++) {
    const isToday = isCurrentMonth && d === today.getDate();
    days.push(
      <span key={d} className={isToday ? 'today' : ''}>
        {d}
      </span>
    );
  }

  return (
    <div className='calendar'>
      <div className="navigate-date">
        <h2 className="month">{monthNames[month]}</h2>
        <h2 className="year">{year}</h2>
        <div className="buttons">
          <i className="bx bx-chevron-left" onClick={prevMonth}></i>
          <i className="bx bx-chevron-right" onClick={nextMonth}></i>
        </div>
      </div>

      <div className='Weekdays'>
        <div className='day'>Sun</div>
        <div className='day'>Mon</div>
        <div className='day'>Tue</div>
        <div className='day'>Wed</div>
        <div className='day'>Thu</div>
        <div className='day'>Fri</div>
        <div className='day'>Sat</div>
      </div>

      <div className="days">{days}</div>
    </div>
  );
};

export default Calendar;
