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

import algoliasearch from 'algoliasearch';

const ALGOLIA_ID = 'H56CMW6HOC';
const ALGOLIA_ADMIN_KEY = 'acaf789b31d8c2d219e4d1bf9e076010';
const ALGOLIA_SEARCH_KEY = '17e18193bf74feff1f12561fdc8279d6';
const ALGOLIA_INDEX_NAME = 'lyrics';
const client = algoliasearch(ALGOLIA_ID, ALGOLIA_ADMIN_KEY);
var index = client.initIndex(ALGOLIA_INDEX_NAME);
class LyricsIndexAll extends Component {
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

    fetchLastIndexedKey = () => {
        base.fetch(`lyricsIndexing`, {
            context: this,
            then(data) {
                console.log("indexing",data);
                if(data && data.lastIndexedKey) {
                    this.setState({
                        lastKey : data.lastIndexedKey
                    },()=>{this.fetchData()})   
                }else {
                    this.fetchData();
                }
                
            }
        });
    }
    indexData= (data) => {

        const indexSetting = {
            lastIndexedKey : this.state.lastKey
        }
        if(!data)
            return;
        data.map(item => {
            item.objectID = item.key;
            item._id = item.key;
            index.saveObject(item);
            console.log("indexing Item",item);
        })
        base.post(`lyricsIndexing`, {
            data: indexSetting,
            then(err) {
                if (!err) {
                   // toast.success('Configs successfully updated!');
                } else {
                    toast.error(err);
                }
            }
        });
        this.fetchData();
    }

    fetchData = () => {
        this.setState({
            dataLoading: true
        }, () => {
            let { perPage, lastKey } = this.state

            let queries = {
                orderByKey: true,
                limitToFirst: perPage + 1
            }

            if (lastKey)
                queries.startAt = lastKey

            base.fetch('lyrics', {
                context: this,
                asArray: true,
                queries
            })
                .then(result => {
                    if (result.length <=1) {
                        this.setState({
                            dataLoading: false
                        })

                        return;
                    }

                    // let { data } = this.state
                    const lastKey = result[result.length-1].key
                    console.log("LastKey", lastKey);
                    const isNextPage = !(result.length <= perPage)

                    result = isNextPage ? result.slice(1, result.length) : result

                    this.setState(prevState => {
                        return {
                            //data: update(prevState.data, { $push: result.reverse() }),
                            dataLoading: false,
                            isNextPage,
                            lastKey
                        }
                    }, ()=>{
                        this.indexData( result.reverse());
                    })
                })
                .catch(error => {
                    console.log('Error was occurred during fetching lyrics: ', error)
                })
        })
    }

    componentDidMount = () => {
        this.fetchLastIndexedKey();
    }

    render = () =>
        <Fragment>
            <DataLoadStat
                dataLoading={this.state.dataLoading}
                dataLength={this.state.data.length}
            />
        </Fragment>
}

export default LyricsIndexAll