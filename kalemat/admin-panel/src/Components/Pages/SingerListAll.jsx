import React, { Component, Fragment } from 'react'
import update from 'react-addons-update'
import { toast } from 'react-toastify'

import { base } from '../ReBase'
import { storage } from 'firebase/app'
import 'firebase/storage'

import { ListCard, DataLoadStat, Search, AddNewItem } from '../Partials'

import { Modal } from '../Modal'
import { EditSingerModal } from '../Modal/EditSingerModal'
import { AddNewSingerModal } from '../Modal/AddNewSingerModal'

class SingersListAll extends Component {
    state = {
        data: [],
        dataLoading: true,
        editModalIsOpen: false,
        addNewModalIsOpen:false,
        modalData: {},
        addNewSingerData: {
            imageUrl: '',
            name: '',
        },
        searchInputVal: '',
        isUploading: false,
        uploadingProgress: 0,
        avatar: ''
    }

    pushData = () => {
        const {name, imageUrl} = this.state.addNewSingerData

        let data = {
            name: name,
            imageUrl: imageUrl
        }

        base.push('singers', {
            data
        })
            .then(reference => {
                data.key = reference.key

                this.setState({
                    data: update(this.state.data, { $unshift: [data] })
                })

                toast.success('new singer added successfully')
            })
            .catch(error => {
                toast.error('Error, adding new singer failed!')
                console.log('Error, adding new singer failed:', error)
            })
    }
    fetchData = () => {
        this.setState({
            dataLoading: true
        }, () => {
            base.fetch('singers', {
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
                        data       : result.reverse(),
                        dataLoading: false
                    })
                })
                .catch(error => {
                    console.log('Error was occurred during fetching Singer: ', error)
                })
        })
    }

    deleteData = (key) => {
        if (window.confirm('are you sure you want to delete')) {
            base.remove(`singers/${key}`)
                .then(() => {
                    this.setState(prevState => {
                        return {
                            data: prevState.data.filter(data => data.key !== key)
                        }
                    }, () => {
                        toast.info('data was removed successfully')
                    })
                })
                .catch(error => {
                    console.log('Error, removing Singer failed!', error)
                    toast.error('Error, removing Singer failed!')
                })
        }
    }


    handleSearchInput = ({ target: { value } }) => {
        this.setState({
            searchInputVal: value
        })
    }

    handleOpenEditModal = (modalDataKey) => {

        this.setState({
            editModalIsOpen: true
        }, () => {
            base.fetch('singers', {
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

    componentDidMount = () => {
        this.fetchData()
    }




    // start 👾

    handleAddNewSingerModuleOpen = () => {
        this.setState({
            addNewModalIsOpen: true
        })
    }
    handleEditSingerCloseModal = () => {
        this.setState({
            editModalIsOpen: false
        })
    }
    handleModuleInputChange = ({ target: { value, name } }) => {
        this.setState(prevState => {
            return {
                modalData: {
                    ...prevState.modalData,
                    [name]: value
                }
            }
        })
    }
    handleModuleUpdate = () => {
        const {
            key,
            name,
        } = this.state.modalData

        base.update(`singers/${key}`, {
            data: {
                name
            }
        })
            .then(() => {
                let { data, modalData } = this.state

                const indexOfChangedData = data.findIndex(element => element.key === key)

                this.setState({
                    data: update(data, { [indexOfChangedData]: { $merge: modalData } })
                }, () => {
                    this.handleEditSingerCloseModal()
                })

                toast.info(`${name} updated successfully`)
            })
            .catch(error => {
                console.log(`${name} update failed`, error)
                toast.error(`${name} update failed`, error)
            })
    }
    handleAddNewSingerModuleClose = () => {
        this.setState({
            addNewModalIsOpen: false
        })
    }



    handleAddNewSingerInputChange = ({ target: { value, name } }) => {
        this.setState(prevState => {
            return {
                addNewSingerData: {
                    ...prevState.addNewSingerData,
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
                    addNewSingerData: {
                        ...prevState.addNewSingerData,
                        imageUrl
                    }
                }
            }, () => {
                this.setState({
                    isUploading: false
                })
            }))
    }

    handleModuleDateInputChange = (date) => {
        console.log(new Date(date).getTime())

        this.setState(prevState => {
            return {
                addNewSingerData: {
                    ...prevState.addNewSingerData,
                    date: new Date(date).getTime()
                }
            }
        })
    }

    render = () =>
        <Fragment>

            <Search
                searchInputHandler={this.handleSearchInput}
                value={this.state.searchInputVal}
            />



            {!Boolean(this.state.searchInputVal.length) && this.state.data.map(({ key, imageUrl, name }) =>
                <ListCard
                    key={key}
                    data={{
                        key,
                        imageUrl: imageUrl,
                        title: name
                    }}
                    openEditModalHandler={this.handleOpenEditModal}
                    deleteHandler={this.deleteData}
                    banHandler={this.banUser}
                />
            )}


            <DataLoadStat
                dataLoading={this.state.dataLoading}
                dataLength={this.state.data.length}
            />



            <AddNewItem clickHandler={this.handleAddNewSingerModuleOpen} />

                <Modal
                    closeHandler={this.handleEditSingerCloseModal}
                    isOpen={this.state.editModalIsOpen}
                >
                    <EditSingerModal
                        data={this.state.modalData}
                        inputController={this.handleModuleInputChange}
                        updateHandler={this.handleModuleUpdate}
                    />
                </Modal>


                <Modal
                    closeHandler={this.handleAddNewSingerModuleClose}
                    isOpen={this.state.addNewModalIsOpen}
                >
                    <AddNewSingerModal
                        data                         = {this.state.addNewSingerData}
                        inputController              = {this.handleAddNewSingerInputChange}
                        pushHandler                  = {this.pushData}
                        onUploadStart                = {this.handleUploadStart}
                        onUploadError                = {this.handleUploadError}
                        onUploadSuccess              = {this.handleUploadSuccess}
                        onProgress                   = {this.handleUploadProgress}
                        isUploading                  = {this.state.isUploading}
                        uploadingProgress            = {this.state.uploadingProgress}
                        avatar                       = {this.state.avatar}
                        imageUrl                     = {this.state.addNewSingerData.imageUrl}
                        moduleDateInputChangeHandler = {this.handleModuleDateInputChange}
                    />
                </Modal>





        </Fragment>
}

export default SingersListAll