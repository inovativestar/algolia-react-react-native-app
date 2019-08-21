import React, { Component, Fragment } from 'react'
import update from 'react-addons-update'
import { toast } from 'react-toastify'

import { base } from '../ReBase'
import { List, Pagination, DataLoadStat } from '../Partials'

class UsersListAll extends Component {
    state = {
        data: [],
        dataLoading: true,
        isNextPage: false,
        perPage: 10,
        lastKey: ''
    }

    fetchData = () => {
        this.setState({
            dataLoading: true
        }, () => {
            let { perPage, lastKey } = this.state

            let queries = {
                orderByKey: true,
                limitToLast: perPage + 1
            }

            if (lastKey)
                queries.endAt = lastKey

            base.fetch('usersBad', {
                context: this,
                asArray: true,
                queries
            })
                .then(result => {
                    if (result.length === 0) {
                        this.setState({
                            dataLoading: false
                        })

                        return
                    }

                    // let { data } = this.state
                    const lastKey = result[0].key

                    const isNextPage = !(result.length <= perPage)

                    result = isNextPage ? result.slice(1, result.length) : result

                    // this.setState({
                    //     data: update(data, { $push: result.reverse() }),
                    //     dataLoading: false,
                    //     isNextPage,
                    //     lastKey: lastKey
                    // })

                    this.setState(prevState => {
                        return {
                            data: update(prevState.data, { $push: result.reverse() }),
                            dataLoading: false,
                            isNextPage,
                            lastKey
                        }
                    })
                })
                .catch(error => {
                    console.log('Error was occurred during fetching lyrics: ', error)
                })
        })
    }

    deleteData = (key) => {
        if (window.confirm('are you sure you want to delete')) {
            base.remove(`usersBanned/${key}`)
                .then(() => {
                    this.setState(prevState => {
                        return {
                            data: prevState.data.filter(data => data.key !== key)
                        }
                    }, () => {
                        toast.info('user was removed successfully')
                    })
                })
                .catch(e => {
                    console.log('Error, removing user failed!', e)
                    toast.error('Error, removing user failed!')
                })
        }
    }

    unbadUser = (key) => {
        base.fetch(`usersBad/${key}`, {})
            .then(data => {
                base.push('users', {
                    data
                })
                    .then(() => {
                        base.remove(`usersBad/${key}`)
                            .then(() => {
                                this.setState(prevState => {
                                    return {
                                        data: prevState.data.filter(data => data.key !== key)
                                    }
                                }, () => {
                                    toast.info('User moved to normal/good list successfully')
                                })
                            })
                    })
            })
    }

    componentDidMount = () => {
        this.fetchData()
    }

    render = () =>
        <Fragment>
            {this.state.data.map(({ key, email }) =>
                <List
                    key={key}
                    data={{
                        key,
                        title: email
                    }}
                    deleteHandler={this.deleteData}
                    unbadHandler={this.unbadUser}
                />
            )}

            <DataLoadStat
                dataLoading={this.state.dataLoading}
                dataLength={this.state.data.length}
            />

            <Pagination
                dataFetcher={this.fetchData}
                isNextPage={this.state.isNextPage}
                isDataLoading={this.state.dataLoading}
            />
        </Fragment>
}

export default UsersListAll