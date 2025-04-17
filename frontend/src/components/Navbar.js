import React from 'react'
import { NavLink } from "react-router-dom"


export default function Navbar ({user}) {
    return(
        <div className="navbar">
            <NavLink className="main" exact to ="/">Chezz</NavLink>
            <NavLink to="/playvscomputer"> Play vs. AI </NavLink>
            <NavLink to="/randvsrand"> Human vs. Human </NavLink>
            <NavLink to="/visualize"> Visualize The AI Algorithm</NavLink>
        </div>
    )
}

