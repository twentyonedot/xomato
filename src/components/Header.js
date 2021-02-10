import React from 'react'
import './Header.css'


export default class Header extends React.Component {
	render() {
		return (
			<div className="header">
				<div className="header-title">
					<img className="logo" src="logo.png" alt="XMeme-icon"></img>
				</div>
                {this.props.children}
			</div>
		)
	}
}
