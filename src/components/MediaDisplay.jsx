import { Component, Fragment } from 'react';
import {
    Col,
    Row,
} from 'reactstrap'
import ImageDisplay from './ImageDisplay';
import VideoDisplay from './VideoDisplay';
import CarouselControls from './CarouselControls';
import { MdFollowTheSigns } from 'react-icons/md';

class MediaDisplay extends Component {
    constructor(props) {
        super(props)

        this.state = {
            fadeInClass: "fade-in-start",
            num: 0
        }
    }

    onChange = (num) => {
        this.setState({
            num: num,
        })
    }

    sleep = (milliseconds) => {
        return new Promise(resolve => setTimeout(resolve, milliseconds))
    }

    onLoad = async () => {
        this.setState({ fadeInClass: "fade-in-start" })
        await this.sleep(1000)
        this.setState({ fadeInClass: "fade-in-end" })
    }

    render() {
        let data = this.props.data
        let content = data.content
        let description = data.description
        let num = this.state.num
        let numContent = content.length
        let media = [];
        let darkMode = this.props.darkMode === true
        let descriptionClassNames = "image-description"
        let centered = !(this.props.centered === false)

        if (darkMode) {
            descriptionClassNames += " dark-mode"
        }

        for (let i = 0; i < numContent; i++) {
            let current = content[i]
            let url = current.url
            let type = current.type

            if (type === "image") {
                media.push(<ImageDisplay
                    url={url}
                    callback={this.onLoad}
                    alt={description}
                    active={num === i}
                    darkMode={darkMode}
                />)
            } else if (type === "video") {
                media.push(<VideoDisplay url={url} callback={this.onLoad} />)
            }
        }

        let carouselControls = numContent > 1 ?
            (<CarouselControls numContent={numContent} onChange={this.onChange}
                darkMode={darkMode}
            />)
            : (null)

        let rowClassNames = this.state.fadeInClass

        if (centered) {
            rowClassNames += " centered-row"
        }

        return (
            <div className={rowClassNames}>
                <div className='media-display'>
                    {media}
                    {carouselControls}
                    <div className={descriptionClassNames}>
                        <p>{description}</p>
                    </div>
                </div>
            </div>
        )
    }
}

export default MediaDisplay;