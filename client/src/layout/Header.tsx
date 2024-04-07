import React from 'react'
import { Link } from 'react-router-dom'

const Header=()=> {
  return (
    <div className="sticky-top">
      <nav>
        <div className='header-nav'>
            <Link to="/">홈으로</Link>
            <Link to="/user/azeuser">회원 관리</Link>
            <Link to="/game/gameTitle">대회 관리</Link>
            <Link to="/game/gameTeam">대회팀 관리</Link>
            <Link to="/game/gamePlay">경기 관리</Link>
            <Link to="/game/gameRs">경기 결과 관리</Link>
        </div>
      </nav>     
    </div>

  )
}

export default Header
