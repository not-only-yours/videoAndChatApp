// eslint-disable-next-line no-undef
const socket = io('/')
const myVideo = document.createElement('video')
myVideo.muted = true
let myVideoStream
const videoGrid = document.getElementById('video-grid')

// eslint-disable-next-line no-undef
const peer = new Peer(undefined, {
	path: '/peerjs',
	host: '/',
	port: '3000',
})
navigator.mediaDevices
	.getUserMedia({
		video: true,
		audio: true,
	})
	.then((stream) => {
		// eslint-disable-next-line no-unused-vars
		myVideoStream = stream
		addVideoStream(myVideo, stream)

		peer.on('call', (call) => {
			call.answer(stream)
			const video = document.createElement('video')
			call.on('stream', (userVideoStream) => {
				addVideoStream(video, userVideoStream)
			})
		})

		socket.on('user-connected', (userId) => {
			connectToNewUser(userId, stream)
		})
	})

peer.on('open', (id) => {
	// eslint-disable-next-line no-undef
	socket.emit('join-room', ROOM_ID, id)
})

const connectToNewUser = (userId, stream) => {
	const call = peer.call(userId, stream)
	const video = document.createElement('video')
	call.on('stream', (userVideoStream) => {
		addVideoStream(video, userVideoStream)
	})
}

const addVideoStream = (video, stream) => {
	video.srcObject = stream
	video.addEventListener('loadedmetadata', () => {
		video.play()
	})
	videoGrid.append(video)
}