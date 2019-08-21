import React, { Component, Fragment } from 'react'
import { toast } from 'react-toastify'

import { base } from '../ReBase'
import { List, DataLoadStat, Search } from '../Partials'

class UsersListAll extends Component {
    state = {
        data: [],
        dataLoading: true,
        searchInputVal: ''
    }

    fetchData = () => {
        this.setState({
            dataLoading: true
        }, () => {
            base.fetch('users', {
                context: this,
                asArray: true,
                queries: {
                    orderByKey: true
                }
            })
                .then(result => {
                    if (result.length === 0) {
                        this.setState({
                            dataLoading: false
                        })

                        return
                    }

                    this.setState({
                        data: result.reverse(),
                        dataLoading: false
                    })
                })
                .catch(error => {
                    console.log('Error was occurred during fetching lyrics: ', error)
                })
        })
    }

    deleteData = (key) => {
        if (window.confirm('are you sure you want to delete')) {
            base.remove(`users/${key}`)
                .then(() => {
                    this.setState(prevState => {
                        return {
                            data: prevState.data.filter(data => data.key !== key)
                        }
                    }, () => {
                        toast.info('Song was removed successfully')
                    })
                })
                .catch(error => {
                    console.log('Error, removing song failed!', error)
                    toast.error('Error, removing song failed!')
                })
        }
    }

    badUser = (key) => {
        base.fetch(`users/${key}`, {})
            .then(data => {
                base.push('usersBad', {
                    data
                })
                    .then(() => {
                        base.remove(`users/${key}`)
                            .then(() => {
                                this.setState(prevState => {
                                    return {
                                        data: prevState.data.filter(data => data.key !== key)
                                    }
                                }, () => {
                                    toast.success('User moved to bad list successfully')
                                })
                            })
                    })
            })
            .catch(error => {
                toast.error('Error user was not deleted')
                console.log('Error user could not be found: ', error)
            })
    }

    banUser = (key) => {
        base.fetch(`users/${key}`, {})
            .then(data => {
                base.push('usersBanned', {
                    data
                })
                    .then(() => {
                        base.remove(`users/${key}`)
                            .then(() => {
                                // this.setState({
                                //     data: this.state.data.filter((data) => data.key !== key)
                                // }, () => {
                                //     toast.success('User moved to banned list successfully')
                                // })

                                this.setState(prevState => {
                                    return {
                                        data: prevState.data.filter(data => data.key !== key)
                                    }
                                }, () => {
                                    toast.success('User moved to banned list successfully')
                                })
                            })
                    })
            })
            .catch(error => {
                toast.error('Error user was not deleted')
                console.log('Error user could not be found: ', error)
            })
    }

    handleSearchInput = ({ target: { value } }) => {
        this.setState({
            searchInputVal: value
        })
    }

    componentDidMount = () => {
        this.fetchData()
    }

    render = () =>
        <Fragment>

            <Search
                searchInputHandler={this.handleSearchInput}
                value={this.state.searchInputVal}
            />

            {/* <input value={this.state.searchInputVal} placeholder="Search here..." onChange={this.handleSearchInput} /> */}


            {!Boolean(this.state.searchInputVal.length) && this.state.data.map(({ key, email }) =>
                <List
                    key={key}
                    data={{
                        key,
                        title: email,
                    }}
                    deleteHandler={this.deleteData}
                    banHandler={this.banUser}
                    badHandler={this.badUser}
                />
            )}

            {Boolean(this.state.searchInputVal.length) && this.state.data.map(({ key, email }) => {
                if (email.match(new RegExp(this.state.searchInputVal, 'g')))
                    return <List
                        key={key}
                        data={{
                            key,
                            title: email
                        }}
                        deleteHandler={this.deleteData}
                        banHandler={this.banUser}
                        badHandler={this.badUser}
                    />
            })}

            <DataLoadStat
                dataLoading={this.state.dataLoading}
                dataLength={this.state.data.length}
            />
        </Fragment>
}

export default UsersListAll