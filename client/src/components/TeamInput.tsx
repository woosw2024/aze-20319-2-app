import React from 'react'
import { gameTeamData } from '../model/MGameTeam'

interface OwnProps {
  teamData : gameTeamData[]|undefined;
  redTeam : string;
}
const TeamInput:React.FC<OwnProps> = (prop) => {
  return (
    <div>
{
                  prop.teamData?.length !== 0 ?
                  prop.teamData?.map((item, index) => (
                      <div>{item.lolNick}</div>
                    )) : <div>데이터 없음</div>
                }
    </div>
  )
}

export default TeamInput
