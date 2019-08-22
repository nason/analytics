import React from 'react'
import { Link } from "@reach/router"
import ForkMe from '../../components/ForkMe'
import './Nav.css'

const Navigation = () => {
  return (
    <div className="navigation">
      <Link to='/'>Home</Link>
      <Link to='/listeners'>Listeners</Link>
      <Link to='/state'>State</Link>
      <Link to='/kitchen-sink'>Kitchen Sink</Link>
      <a href='https://getanalytics.io/' target='_blank' rel='noopener noreferrer'>
        Documentation
      </a>
      <ForkMe url='https://github.com/DavidWells/analytics' />
    </div>
  )
}

export default Navigation
