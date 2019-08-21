import React, { Fragment } from 'react'
import styled from 'styled-components'

export const InspectLyricsModal = ({
    data: { songName, singer, lyricText, lyricsMeta, imageUrl, date }
}) => {
    return <Fragment>
        <Title>{songName}</Title>
        <Singer>{singer}</Singer>

        <Container>
            <Img src={imageUrl} alt="" />

            <MetadataCont>
                {lyricsMeta.map(({ metaKey, metaValue }, key) =>
                    <Metadata key={key}>
                        <span style={{ textTransform: 'capitalize' }}>{metaKey}</span>: {metaValue}
                    </Metadata>
                )}

                <Lyrics>{lyricText}</Lyrics>
            </MetadataCont>
        </Container>
    </Fragment>
}

const
    Title = styled.h3`
        color: #444;
        font-weight: 400;
    `,

    Container = styled.div`
        display: flex;
        flex-direction: row;
        align-items: flex-start;

        margin-top: 30px;
    `,

    MetadataCont = styled.div`
        padding-left: 30px;
    `,

    Metadata = styled.div`
        margin-bottom: 10px;
        font-size: 15px;
        color: #222;
    `,

    Img = styled.img`
        max-width: 30%;
        height: auto;
    `,

    Singer = styled.h4`
        color: #777;
        font-weight: 400;
    `,

    Lyrics = styled.p`
        font-size: 15px;
        margin-top: 22px;
        line-height: 26px;
        color: #444;
    `