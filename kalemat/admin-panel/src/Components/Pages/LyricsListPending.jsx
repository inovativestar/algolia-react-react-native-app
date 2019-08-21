import React, { Component, Fragment } from 'react'
import update from 'react-addons-update'
import { toast } from 'react-toastify'

import { base } from '../ReBase'
import { Modal } from '../Modal'
import { InspectLyricsModal } from '../Modal/InspectLyricsModal'
import { List, Pagination, DataLoadStat } from '../Partials'

class LyricsListPending extends Component {
    state = {
        data: [],
        dataLoading: true,
        isNextPage: false,
        perPage: 10,
        lastKey: '',
        inspectModalData: {},
        inspectModalIsOpen: false
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

            base.fetch('lyricsPending', {
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
                    toast.error('Error fetching lyrics failed')
                    console.log('Error fetching lyrics failed:', error)
                })
        })
    }

    handleApprove = (key) => {
        base.fetch(`lyricsPending/${key}`, {})
            .then(data => {
                base.push('lyrics', {
                    data: {
                        ...data,
                        downvote: 0,
                        upvote: 0,
                        viewCount: 0
                    }
                })
                    .then(() => {
                        toast.success(`${data.songName} has been copied to lyrics list successfully`)

                        base.remove(`lyricsPending/${key}`)
                            .then(() => {
                                // this.setState({
                                //     data: this.state.data.filter(data => data.key !== key)
                                // }, () => {
                                //     toast.info(`${data.songName} has been removed from pending lyrics list successfully`)
                                // })

                                this.setState(prevState => {
                                    return {
                                        data: prevState.data.filter(data => data.key !== key)
                                    }
                                }, () => {
                                    toast.info(`${data.songName} has been removed from pending lyrics list successfully`)
                                })
                            })
                            .catch(() => {
                                toast.error(`Error, removing ${data.songName} from pending lyrics list failed!`)
                            })
                    })
                    .catch(error => {
                        toast.error("Error has been occurred during song approval")
                        console.log('Error has been occurred during song approval: ', error)
                    })
            })
            .catch(error => {
                toast.error('Error, fetching song lyrics failed!')
                console.log('Error, fetching song lyrics failed:', error)
            })
    }

    inspectLyrics = (key) => {
        base.fetch(`lyricsPending/${key}`, {})
            .then(result => {
                this.setState({
                    inspectModalData: result,
                    inspectModalIsOpen: true
                })
            })
    }

    deleteData = (key) => {
        if (window.confirm('are you sure you want to delete')) {
            base.remove(`lyricsPending/${key}`)
                .then(() => {
                    // this.setState({
                    //     data: this.state.data.filter((data) => data.key !== key)
                    // }, () => {
                    //     toast.info('Song has been removed successfully')
                    // })

                    this.setState(prevState => {
                        return {
                            data: prevState.data.filter(data => data.key !== key)
                        }
                    }, () => {
                        toast.info('Song has been removed successfully')
                    })
                })
                .catch(error => {
                    console.log('Error, removing song failed:', error)
                    toast.error('Error, removing song failed')
                })
        }
    }

    componentDidMount = () => {
        this.fetchData()
    }

    handleInspectModalClose = () => {
        this.setState({
            inspectModalIsOpen: false
        })
    }

    render = () =>
        <Fragment>
            {this.state.data.map(({
                key,
                imageUrl,
                songName,
                viewCount,
                upvote,
                downvote
            }) => <List
                    key={key}
                    inspectHandler={this.inspectLyrics}
                    deleteHandler={this.deleteData}
                    approveHandler={this.handleApprove}
                    data={{
                        key,
                        imageUrl,
                        title: songName
                    }}
                />)}

            <DataLoadStat
                dataLoading={this.state.dataLoading}
                dataLength={this.state.data.length}
            />

            <Pagination
                dataFetcher={this.fetchData}
                isNextPage={this.state.isNextPage}
                isDataLoading={this.state.dataLoading}
            />

            <Modal
                closeHandler={this.handleInspectModalClose}
                isOpen={this.state.inspectModalIsOpen}
            >
                <InspectLyricsModal
                    data={this.state.inspectModalData}
                />
            </Modal>
        </Fragment>
}

export default LyricsListPending