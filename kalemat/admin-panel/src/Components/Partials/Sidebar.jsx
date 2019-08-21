import React from 'react'
import { NavLink } from 'react-router-dom'
import styled from 'styled-components'

// Fonts
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCogs } from '@fortawesome/free-solid-svg-icons'

export const Sidebar = ({ match: { path }, location: { pathname } }) =>
    <SidebarStyle>
        <div>
            <Logo>LYRICS.COM</Logo>

            <MenuItem current={"/lyrics"}>
                <NavLink to={"/lyrics"} activeClassName="current">
                    <FontAwesomeIcon
                        icon="book"
                        fixedWidth
                        className="icon"
                        size="sm"
                    />

                    Lyrics
                </NavLink>
            </MenuItem>

            <MenuItem current={"/users"}>
                <NavLink to={"/users"} activeClassName="current">
                    <FontAwesomeIcon
                        icon="users"
                        fixedWidth
                        className="icon"
                        size="sm"
                    />

                    Users
                </NavLink>
            </MenuItem>

            <MenuItem current={"/singers"}>
                <NavLink to={"/singers"} activeClassName="current">
                    <FontAwesomeIcon
                        icon="music"
                        fixedWidth
                        className="icon"
                        size="sm"
                    />

                    Singers
                </NavLink>
            </MenuItem>


            <MenuItem current={"/configs"}>
                <NavLink to={"/configs"} activeClassName="current">
                    <FontAwesomeIcon
                        icon={faCogs}
                        fixedWidth
                        className="icon"
                        size="sm"
                    />

                    Configs
                </NavLink>
            </MenuItem>
        </div>
    </SidebarStyle>

const
    SidebarStyle = styled.div`
        box-sizing: border-box;
        display: flex;
        flex-direction: column;
        align-items: center;

        position: fixed;

        height: 100vh;

        width: 220px;

        box-shadow: 0 0 50px -10px rgba(0,0,0,.05);

        background: #fff;
    `,

    Logo = styled.h1`
        font-size: 1rem;
        font-weight: 900;
        padding: 40px 0;
        color: #212121;
    `,

    MenuItem = styled.div`
        margin-bottom: 4px;
        padding: 10px 0;

        color: #616161;
        font-weight: 400;

        transition: color 250ms;

        & .current {
            color: #424242;
            font-weight: 600;
        }

        &:active {
            color: #424242;
        }

        .icon {
            margin-right: 16px;
        }
    `