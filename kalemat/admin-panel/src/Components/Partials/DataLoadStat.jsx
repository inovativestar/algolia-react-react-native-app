import React, { Fragment } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import loadingBars from '../../assets/svg/loading-bars.svg'

export const DataLoadStat = ({ dataLoading, dataLength }) =>
    (dataLoading || (!dataLoading && !Boolean(dataLength))) &&
    <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100px',
        background: '#fff',
        color: '#616161'
    }}>
        {dataLoading &&
            <img src={loadingBars} alt="" />
        }

        {(!dataLoading && !Boolean(dataLength)) &&
            <Fragment>
                <FontAwesomeIcon
                    icon="exclamation-circle"
                    fixedWidth
                    className="icon"
                    size="lg"
                />
                &nbsp;
                <span style={{ color: '#333' }}>Content not found</span>
            </Fragment>
        }
    </div>