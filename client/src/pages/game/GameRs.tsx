import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import interactionPlugin from "@fullcalendar/interaction" // needed for dayClick
import { Col, Row } from 'react-bootstrap'

/* document.addEventListener('DOMContentLoaded', function() {
  let calendarEl: HTMLElement = document.getElementById('calendar')!;

  let calendar = new Calendar(calendarEl, {
    plugins: [ dayGridPlugin ]
    // options here
  });

  calendar.render();
}); */
const GameRs = () => {
  const events = [
    { title: 'Meeting1', start: new Date('2024-04-29') },
  	{ title: 'Meeting2', start: new Date('2024-04-30') }
  ]
  return (
    <div>
      <Row>
        <Col>      
          <FullCalendar
            plugins={[ dayGridPlugin, interactionPlugin ]}
            initialView='dayGridMonth'
            events={events}
            locale="kr"
            headerToolbar={{
              left: '',
              center: 'title',
              right: 'today prev next',
            }}
          />
        </Col>
        <Col>
            <div>가나다라마바사</div>
        </Col>
      </Row>
    </div>
  )
}

export default GameRs
