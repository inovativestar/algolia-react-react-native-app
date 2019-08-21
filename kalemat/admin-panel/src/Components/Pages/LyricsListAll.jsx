import React, { Component, Fragment } from 'react'
import update from 'react-addons-update'
import { toast } from 'react-toastify'
import { InstantSearch, Hits, SearchBox, Pagination } from 'react-instantsearch-dom'
import { storage } from 'firebase/app'
import 'firebase/storage'

import { base } from '../ReBase'
import { List, Pagination as MyPagination, DataLoadStat , AddNewItem } from '../Partials'
import { Modal } from '../Modal'
import { EditLyricModal } from '../Modal/EditLyricModal'
import { AddNewSongModal } from '../Modal/AddNewSongModal'

class LyricsListAll extends Component {
    state = {
        data: [],
        dataLoading: true,
        isNextPage: false,
        perPage: 10,
        lastKey: '',
        editModalIsOpen: false,
        modalData: {},
        addNewModalIsOpen: false,
        searchInputValue: '',
        addNewSongData: {
            userId: '-LHr_MFYvooMBZsyhNaR',
            songName: '',
            singer: '',
            lyricsMeta: [],
            imageUrl: '',
            rithm: '',
            tone: '',
            lyricText: '',
            date: +new Date(),
            viewCount: 0,
            upvote: 0,
            downvote: 0,
        },
        isUploading: false,
        uploadingProgress: 0,
        avatar: ''
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

            base.fetch('lyrics', {
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
            base.remove(`lyrics/${key}`)
                .then(() => {
                    this.setState(prevState => {
                        return {
                            data: prevState.data.filter(data => data.key !== key)
                        }
                    })

                    toast.info('Song was removed successfully')
                })
                .catch(error => {
                    console.log('Error, removing song failed!', error)
                    toast.error('Error, removing song failed!')
                })
        }
    }

    handleOpenEditModal = (modalDataKey) => {
        this.setState({
            editModalIsOpen: true
        }, () => {
            base.fetch('lyrics', {
                context: this,
                asArray: true,
                queries: {
                    orderByKey: true,
                    equalTo: modalDataKey
                }
            })
                .then((result) => {
                    this.setState({
                        modalData: result[0]
                    })
                })
                .catch((error) => {
                    console.log("Error occurred during fatching data for modal: ", error)
                })
        })
    }

    handleEditSongCloseModal = () => {
        this.setState({
            editModalIsOpen: false
        })
    }

    handleModuleInputChange = ({ target: { value, name } }) => {
        // this.setState({
        //     modalData: {
        //         ...this.state.modalData,
        //         [name]: value
        //     }
        // })

        this.setState(prevState => {
            return {
                modalData: {
                    ...prevState.modalData,
                    [name]: value
                }
            }
        })
    }

    handleModuleDateInputChange = (date) => {
        console.log(new Date(date).getTime())

        this.setState(prevState => {
            return {
                addNewSongData: {
                    ...prevState.addNewSongData,
                    date: new Date(date).getTime()
                }
            }
        })
    }

    handleModuleUpdate = () => {
        const {
            key,
            songName,
            singer,
            viewCount,
            lyricText,
            lyricsMeta
        } = this.state.modalData

        base.update(`lyrics/${key}`, {
            data: {
                songName,
                singer,
                viewCount,
                lyricText,
                lyricsMeta
            }
        })
            .then(() => {
                let { data, modalData } = this.state

                const indexOfChangedData = data.findIndex(element => element.key === key)

                this.setState({
                    data: update(data, { [indexOfChangedData]: { $merge: modalData } })
                }, () => {
                    this.handleEditSongCloseModal()
                })

                toast.info(`${songName} updated successfully`)
            })
            .catch(error => {
                console.log(`${songName} update failed`, error)
                toast.error(`${songName} update failed`, error)
            })
    }

    handleModuleMetadataInputChange = ({ target: { value, name } }) => {
        // let lyricsMeta = this.state.data.lyricsMeta

        // this.setState({
        //     modalData: {
        //         ...this.state.modalData,
        //         lyricsMeta: lyricsMeta.map(({ metaKey, metaValue }) => {
        //             return { metaKey, metaValue: name === metaKey ? value : metaValue }
        //         })
        //     }
        // })

        this.setState(prevState => {
            return {
                modalData: {
                    ...prevState.modalData,
                    lyricsMeta: prevState.modalData.lyricsMeta.map(({ metaKey, metaValue }) => {
                        return { metaKey, metaValue: name === metaKey ? value : metaValue }
                    })
                }
            }
        })
    }

    handleAddNewSongModuleOpen = () => {
        this.setState({
            addNewModalIsOpen: true
        })
    }

    handleAddNewSongModuleClose = () => {
        this.setState({
            addNewModalIsOpen: false
        })
    }

    handleAddNewSongInputChange = ({ target: { value, name } }) => {
        // this.setState({
        //     addNewSongData: {
        //         ...this.state.addNewSongData,
        //         [name]: value
        //     }
        // })

        this.setState(prevState => {
            return {
                addNewSongData: {
                    ...prevState.addNewSongData,
                    [name]: value
                }
            }
        })
    }

    handleUploadStart = () => this.setState({ isUploading: true, uploadingProgress: 0 })

    handleUploadProgress = uploadingProgress => this.setState({ uploadingProgress })

    handleUploadError = error => this.setState({ isUploading: false })

    handleUploadSuccess = fileName => {
        this.setState({
            avatar: fileName,
            uploadingProgress: 100
        })

        storage()
            .ref('posters')
            .child(fileName)
            .getDownloadURL()
            .then(imageUrl => this.setState(prevState => {
                return {
                    addNewSongData: {
                        ...prevState.addNewSongData,
                        imageUrl
                    }
                }
            }, () => {
                this.setState({
                    isUploading: false
                })
            }))
    }

    pushData = () => {
        const { userId, songName, singer, rithm, tone, lyricText, imageUrl, viewCount, upvote, downvote, date } = this.state.addNewSongData

        let data = {
            userId: userId,
            songName: songName,
            singer: singer,
            lyricsMeta: [
                { metaKey: 'rithm', metaValue: rithm },
                { metaKey: 'tone', metaValue: tone }
            ],
            lyricText: lyricText,
            imageUrl: imageUrl,
            viewCount: viewCount,
            upvote: upvote,
            downvote: downvote,
            date: date
        }

        base.push('lyrics', {
            data
        })
            .then(reference => {
                data.key = reference.key

                this.setState({
                    data: update(this.state.data, { $unshift: [data] })
                })

                toast.success('new song lyrics added successfully')
            })
            .catch(error => {
                toast.error('Error, adding new song lyrics failed!')
                console.log('Error, adding new song lyrics failed:', error)
            })
    }

    searchInputController = ({ target: { value } }) => {
        this.setState({
            searchInputValue: value
        })
    }

    Song = ({ hit }) => {
        return (
            <List
                data={{
                    title: hit.songName,
                    imageUrl: hit.imageUrl,
                    key: hit.objectID,
                    viewCount: hit.viewCount,
                    upvote: hit.upvote,
                    downvote: hit.downvote
                }}
                key={hit.objectID}
                openEditModalHandler={this.handleOpenEditModal}
                deleteHandler={this.deleteData}
            />
        )
    }

    componentDidMount = () => {
        this.fetchData()
    }

    render = () =>
        <Fragment>
            {/* <Search
                searchInputHandler={this.searchInputController}
                value={this.state.searchInputValue}
            /> */}

            <InstantSearch
                appId="H56CMW6HOC"
                apiKey="17e18193bf74feff1f12561fdc8279d6"
                indexName="lyrics"
            >
                <SearchBox onChange={this.searchInputController} />
                {this.state.searchInputValue && <Hits hitComponent={this.Song} />}
                {this.state.searchInputValue && <Pagination />}
            </InstantSearch>

            {!this.state.searchInputValue && this.state.data.map(({
                key,
                imageUrl,
                songName,
                viewCount,
                upvote,
                downvote
            }) => <List
                    key={key}
                    openEditModalHandler={this.handleOpenEditModal}
                    deleteHandler={this.deleteData}
                    data={{
                        key,
                        imageUrl,
                        title: songName,
                        viewCount,
                        upvote,
                        downvote
                    }}
                />)}

            <DataLoadStat
                dataLoading={this.state.dataLoading}
                dataLength={this.state.data.length}
            />

            {!this.state.searchInputValue && <MyPagination
                dataFetcher={this.fetchData}
                isNextPage={this.state.isNextPage}
                isDataLoading={this.state.dataLoading}
            />}

            <AddNewItem clickHandler={this.handleAddNewSongModuleOpen} />

            <Modal
                closeHandler={this.handleEditSongCloseModal}
                isOpen={this.state.editModalIsOpen}
            >
                <EditLyricModal
                    data={this.state.modalData}
                    inputController={this.handleModuleInputChange}
                    metadataInputController={this.handleModuleMetadataInputChange}
                    updateHandler={this.handleModuleUpdate}
                />
            </Modal>


            <Modal
                closeHandler={this.handleAddNewSongModuleClose}
                isOpen={this.state.addNewModalIsOpen}
            >
                <AddNewSongModal
                    data={this.state.addNewSongData}
                    inputController={this.handleAddNewSongInputChange}
                    pushHandler={this.pushData}
                    onUploadStart={this.handleUploadStart}
                    onUploadError={this.handleUploadError}
                    onUploadSuccess={this.handleUploadSuccess}
                    onProgress={this.handleUploadProgress}
                    isUploading={this.state.isUploading}
                    uploadingProgress={this.state.uploadingProgress}
                    avatar={this.state.avatar}
                    imageUrl={this.state.addNewSongData.imageUrl}
                    moduleDateInputChangeHandler={this.handleModuleDateInputChange}
                />
            </Modal>

        </Fragment>
}

export default LyricsListAll