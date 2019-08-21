import React, { Fragment } from 'react'
import { Route, Switch, NavLink } from 'react-router-dom'
import styled from 'styled-components'

// FontAwesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

// styles
import { Button } from '../Styles'

const LyricsHeader = ({ match: { path }, location: { pathname } }) =>
    <Fragment>
        <HeaderItem>
            <NavLink exact to={path}>
                <Button>
                    All lyrics
                </Button>
            </NavLink>
        </HeaderItem>

        <HeaderItem>
            <NavLink exact to={path + "/pending"}>
                <Button>
                    Pending

                    {/* <PandingCount>13</PandingCount> */}
                </Button>
            </NavLink>
        </HeaderItem>
        <HeaderItem>
            <NavLink exact to={path + "/indexing"}>
                <Button>
                    Index
                    {/* <PandingCount>13</PandingCount> */}
                </Button>
            </NavLink>
        </HeaderItem>
    </Fragment>

const UsersHeader = ({ match: { path }, location: { pathname } }) =>
    <Fragment>
        <HeaderItem>
            <NavLink exact to={path}>
                <Button>
                    All users
                </Button>
            </NavLink>
        </HeaderItem>

        <HeaderItem>
            <NavLink exact to={path + "/banned"}>
                <Button>
                    Banned
                </Button>
            </NavLink>
        </HeaderItem>

        <HeaderItem>
            <NavLink exact to={path + "/bad"}>
                <Button>
                    Bad Users
                </Button>
            </NavLink>
        </HeaderItem>
    </Fragment>

export const Header = ({ match: { path }, user, logoutHandler }) => {
    return <HeaderStyle>
        <div>
            <Switch>
                <Route path={`/lyrics`} component={LyricsHeader} />
                <Route path={`/users`} component={UsersHeader} />
            </Switch>
        </div>

        <SignOutWrapper onClick={logoutHandler} email={user.email}>
            <h4>Sign out</h4>

            <FontAwesomeIcon
                icon="sign-out-alt"
                fixedWidth
                className="icon"
                size="sm"
            />
        </SignOutWrapper>

    </HeaderStyle>
}

const
    HeaderStyle = styled.div`
        display: flex;
        align-items: center;
        justify-content: space-between;

        width: 100%;
    `,

    HeaderItem = styled.span`
        margin-right: 30px;

        .active button {
            font-weight: 600;
            color: #424242;
        }
    `,

    // PandingCount = styled.span`
    //     display: inline;
        
    //     padding: 4px;

    //     margin-left: 10px;

    //     font-size: 13px;
    //     font-weight: 600;
    //     letter-spacing: .3px;

    //     border-radius: 10%;
    //     color: #fff;
    //     background: #CFD8DC;
    // `,

    SignOutWrapper = styled.div`
        position: relative;
        display: flex;
        align-items: center;

        cursor: pointer;
        
        padding: 10px;

        border-radius: 6px;
        
        color: #616161;

        transition: 250ms background-color, 250ms color, 250ms box-shadow;

        &:hover {
            &:after {
                position: absolute;
                display: block;
                content: '${props => props.email}';
                bottom: -38px;
                right: 0;
                padding: 5px ;
                background: rgba(0,0,0,.4);
                box-shadow: 0 0 0 1px rgba(0,0,0,.6);
                color: #fff;
            }
        }
        
        h4 {
            margin: 0 12px 0 2px;

            font-weight: 400;
        }

        &:hover {
            color: #424242;
            background: #fff;
        }

        &:active {
            box-shadow: -5px 10px 10px -8px rgba(0,0,0,.05);
        }
    `