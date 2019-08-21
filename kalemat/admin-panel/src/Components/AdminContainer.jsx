import React from 'react'
import { Route, Switch, Redirect } from 'react-router-dom'
import styled from 'styled-components'

// Import Pages
import LyricsListAll from './Pages/LyricsListAll'
import LyricsListPending from './Pages/LyricsListPending'
import LyricsIndexAll from './Pages/LyricsIndexAll'
import UsersListAll from './Pages/UsersListAll'
import UsersListBanned from './Pages/UsersListBanned'
import UsersListBad from './Pages/UsersListBad'
import SingerListAll from './Pages/SingerListAll'
import { Error } from './Pages/Error'

// Import Partials
import { Header, Sidebar } from './Partials'
import Configs from './Pages/Configs';

export const AdminContainer = ({ location, match, user, logoutHandler }) =>
    <Wrapper>
        <Sidebar match={match} location={location} />

        <Container>
            <Route render={(props) => <Header {...props} user={user} logoutHandler={logoutHandler} />} />

            <Devider height="60px" margin="0 0 10px 0" />

            <Route exact path="/" render={() => <Redirect to="/lyrics" />} />

            <Switch>
                <Route
                    exact
                    key={1}
                    path="/lyrics"
                    component={LyricsListAll}
                />
                <Route
                    exact
                    key={2}
                    path="/lyrics/pending"
                    component={LyricsListPending}
                />
                <Route
                    exact
                    key={3}
                    path="/users"
                    component={UsersListAll}
                />
                <Route
                    exact
                    key={4}
                    path="/users/banned"
                    component={UsersListBanned}
                />
                <Route
                    exact
                    key={4}
                    path="/users/bad"
                    component={UsersListBad}
                />
                />
                <Route
                    exact
                    key={3}
                    path="/singers"
                    component={SingerListAll}
                />

                <Route
                    exact
                    key={5}
                    path="/configs"
                    component={Configs}
                />
                <Route
                    exact
                    key={6}
                    path="/lyrics/indexing"
                    component={LyricsIndexAll}
                />
                <Route path="*" render={() => <Error errorText="Page was not found" />} />
            </Switch>
        </Container>
    </Wrapper>

const
    Wrapper = styled.div`
        display: flex;
    `,

    Container = styled.div`
        box-sizing: border-box;
        position: relative;

        width: 100%;
        margin-left: 220px;

        padding: 30px 60px;
    `,

    Devider = styled.div`
        height: ${props => props.height};
        margin: ${props => props.margin};
    `