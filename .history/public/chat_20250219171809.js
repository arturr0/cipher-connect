const baseUrl = window.location.origin;
const socket = io.connect(baseUrl);
const signal = new Audio('sound.mp3');

document.addEventListener('DOMContentLoaded', () => {
	
	document.getElementById("logOut").addEventListener('click', () => {
		window.location.href = '/';
	});
	
	document.getElementById("group").addEventListener('click', () => {
		console.log("click");
		socket.emit('give me friends to group', username);
		const modal = document.getElementById('createGroup');
		modal.style.visibility = 'visible'; // Make it visible immediately
		
		// Trigger the animation
		setTimeout(() => {
			modal.classList.add('show');
		}, 10); 
	});
	
	const menuMessages = document.getElementById('messagesContent');
	const menuInvitation = document.getElementById('invitationContent');
	const menuGroups = document.getElementById('groupsContent');
	const deleteAccount = document.getElementById('deleteAccount');
	
	deleteAccount.addEventListener('click', () => {
		
		const modal = document.getElementById('deleteModal');
		// modal.style.visibility = 'visible'; 
		modal.classList.add('show');
		// Trigger the animation
		// setTimeout(() => {
		// 	modal.classList.add('show');
		// }, 20); 
		
		document.getElementById('confirmDelete').onclick = function() {
			menuGroups.classList.add('dropdown-content');
			menuGroups.classList.add('dropdown');
			menuInvitation.classList.add('dropdown-content');
			menuInvitation.classList.add('dropdown');
			menuMessages.classList.add('dropdown-content');
			menuMessages.classList.add('dropdown');
			modal.classList.remove('show'); 
			socket.emit('delete', username);
		};
		
		document.getElementById('cancelDelete').onclick = function() {
			menuGroups.classList.add('dropdown-content');
			menuGroups.classList.add('dropdown');
			menuInvitation.classList.add('dropdown-content');
			menuInvitation.classList.add('dropdown');
			menuMessages.classList.add('dropdown-content');
			menuMessages.classList.add('dropdown');
			modal.classList.remove('show'); 
		};
		
	});
	
	const createGroupBtn = document.getElementById('sendGroup');
	let avatar = null;
	
	document.getElementById("cancelGroup").addEventListener('click', () => {
		createGroupBtn.style.opacity = '0.5';
		createGroupBtn.style.display = 'none';
		createGroupBtn.disabled = true;
		document.getElementById("createGroup").classList.remove("show");
		avatar = null;
		menuGroups.classList.add('dropdown-content');
		menuGroups.classList.add('dropdown');
		menuInvitation.classList.add('dropdown-content');
		menuInvitation.classList.add('dropdown');
		menuMessages.classList.add('dropdown-content');
		menuMessages.classList.add('dropdown');
		
	});
	
	let storeMessage = true;
	const cryptoDiv = document.getElementById("crypto");
	const originalWidth = cryptoDiv.offsetWidth;
	
	document.getElementById("crypto").addEventListener('click', () => {
		storeMessage = !storeMessage;
		cryptoDiv.style.width = `${originalWidth}px`
		if(document.getElementById("crypto").textContent.includes("No Storing Messages")) {
			
			
			document.getElementById("crypto").textContent = 'Store Messages';
		}
		else document.getElementById("crypto").textContent = 'No Storing Messages';
		const icon = document.createElement('i')
		icon.classList.add('icon-user-secret');
		icon.classList.add('accIon');
		document.getElementById("crypto").appendChild(icon); // Change only the text in the crypto div
	});
	
	const username = localStorage.getItem('username');
	const chat = document.getElementById('messageContainer');
	let receiver = '';
	let group = null;
	
	
	
	if (document.getElementById("message")) {
		document.getElementById("message").addEventListener("keydown", function(e) {
			let messageSent = document.getElementById("message").value;
			const inputValString = String(messageSent);
			
			if (e.key === 'Enter') {
				console.log(receiver, group);
				e.preventDefault();
				if (messageSent !== null && messageSent.trim() !== '' && ((receiver == '' && group != null) || (receiver != '' && group == null))) {
					//const chat = document.getElementById("chat");
					//const receiver = 'art2';
					console.log("my mess");
					const sendTime = new Date().toISOString();;
					console.log(sendTime);
					const hours = new Date().getHours();
					const minutes = new Date().getMinutes();
					
					const sendDiv = document.createElement('div');
					sendDiv.classList.add('bubble', 'left');
					sendDiv.style.wordBreak = 'break-word';
					sendDiv.textContent = inputValString;  // Add the message text
					const timeAndIcon = document.createElement('div');
					timeAndIcon.classList.add('timeAndIcon');
					timeAndIcon.style.display = 'flex';
					timeAndIcon.style.marginLeft = 'auto';
					// Create a paragraph element for the date
					const dateParagraph = document.createElement('p');
					dateParagraph.textContent = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`;  // Format and add the date
					dateParagraph.style.marginBottom = '0';
					
					dateParagraph.style.textAlign = 'right';
					
					// Append the date paragraph to the message div
					if(!storeMessage) {
						const cryptoIcon = document.createElement('i');
						cryptoIcon.classList.add('icon-user-secret');
						cryptoIcon.style.marginRight = '3px';
						cryptoIcon.style.marginTop = 'auto';
						timeAndIcon.appendChild(cryptoIcon);    
					}
					timeAndIcon.appendChild(dateParagraph);
					sendDiv.appendChild(timeAndIcon);
					chat.appendChild(sendDiv);
					adjustMarginForScrollbar();
					
					console.log(username);
					
					if (receiver != '') socket.emit('chatMessage', { username, messageSent, receiver, sendTime, storeMessage });
					else if (group != null)
						socket.emit('group message', { username, group, messageSent, storeMessage, sendTime });
					document.getElementById("message").value = "";
					document.getElementById("message").style.height = '80px';
					console.log(messageSent);
					chat.scrollTo({
						top: chat.scrollHeight,
						behavior: "smooth"
					});
				}
			}
		});
	}
	
	const searchUsers = document.getElementById('searchUsers');
	const friends = document.getElementById('friends');
	
	
	function updatesearchUsersWidth() {
		
		// Calculate the width of the #friends div
		const friendsWidth = friends.offsetWidth; // Get width in pixels
		// Set the width of the #searchUsers div to match the #friends width
		searchUsers.style.width = `${friendsWidth}px`; // Set width in pixels
	}
	
	// Call the function initially to set the width when the page loads
	updatesearchUsersWidth();
	
	const findUsers = document.getElementById('findUsers');
	const switchUsers = document.getElementById('switchUsers');
	const switchFriends = document.getElementById('switchFriends');
	
	findUsers.addEventListener('click', () => {
		console.log("search");
		if (searchUsers.classList.contains('move-left')) {
			usersDiv.style.overflowX = 'hidden';
			// Move both elements to the right
			searchUsers.classList.remove('move-left');
			searchUsers.classList.add('move-right');
			
			friends.classList.remove('move-left2');
			friends.classList.add('move-right2');
			document.getElementById('findUsersText').textContent = "Find users";
			switchUsers.style.display = 'block';
			switchFriends.style.display = 'none';
			
		} else {
			// Move both elements to the left
			usersDiv.style.overflowX = 'auto';
			searchUsers.classList.remove('move-right');
			searchUsers.classList.add('move-left');
			// document.getElementById('friends').style.zIndex = '-10';
			
			friends.classList.remove('move-right2');
			friends.classList.add('move-left2');
			document.getElementById('findUsersText').textContent = "View friends";
			switchUsers.style.display = 'none';
			switchFriends.style.display = 'block';
		}
	});
	
	// Add resize event listener
	window.addEventListener('resize', updatesearchUsersWidth);
	
	socket.on('connect', () => {
		const username = localStorage.getItem('username');
		socket.emit('login', username);
		console.log('Username emitted to server:', username);
	});
	socket.on('deleted', () => {
		window.location.href = '/';    
	});
	
	const receiverElement = document.getElementById('receiverName');
	
	socket.on('broadcastDelete', (data) => {
		
		const targetDivs = document.querySelectorAll('.username'); // Select all .username elements
		
		targetDivs.forEach(div => {
			if (div.textContent == data) { // Match the text content
				const outerParent = div.closest('.user, .friends'); // Find the closest outerparent
				if (outerParent) {
					outerParent.remove(); // Remove the outer parent
					console.log('Removed:', outerParent);
				} else {
					console.log('Outer parent not found for:', div);
				}
			}
		});
		
		if (receiver == data) {
			
			receiver = '';
			receiverAvatar.innerHTML = ''; 
			receiverAvatar.textContent = ''; 
			receiverElement.textContent = '';
			chat.innerHTML = '';
		}
	});
	
	socket.on('user quit group', (data) => {
		
		console.log(data);
		const svgElements = document.querySelectorAll('svg');
		
		// Loop through each SVG element
		svgElements.forEach(svg => {
			// Convert the 'group' attribute to a number for comparison
			const groupId = parseInt(svg.getAttribute('group'), 10);
			
			// Check if the groupId from the SVG matches any ID in the extracted groupIds array
			if (groupId == data.groupId) {
				// Find the <circle> element inside this <svg>
				const circle = svg.querySelector('circle');
				
				// Change the fill color of the circle
				if (circle) {
					circle.setAttribute('fill', 'red');
				}
			}
		});
	});
	
	const messCounter = document.getElementById('messCounter');
	let groupName = '';
	let newMessageCntr = 0;
	
	socket.on('unreadGroupMessageCounts', (data) => {
		
		data.forEach(newMessage => {
			const unreadMessage = document.createElement('div');
			unreadMessage.classList.add('unreadMessages');
			unreadMessage.setAttribute('value', `${newMessage.unreadCount}`);
			unreadMessage.setAttribute('group', newMessage.groupId); 
			unreadMessage.textContent = `${newMessage.groupName} ${newMessage.unreadCount}`;
			document.getElementById("messagesContent").appendChild(unreadMessage);
			newMessageCntr += newMessage.unreadCount  
		});
		messCounter.setAttribute('value', newMessageCntr);
		messCounter.textContent = newMessageCntr;
	});
	socket.on('send group message', (data) => {
		signal.play();
		console.log(data);
		if (group == data.groupOfMessage) {
			adjustMarginForScrollbar();
			
			// Create a div element for the message bubble
			const recDiv = document.createElement('div');
			recDiv.classList.add('bubble', 'right');
			recDiv.style.wordBreak = 'break-word';
			recDiv.textContent = '';
			
			// Create and add sender text
			const senderText = document.createElement('span');
			senderText.textContent = `${data.sender}:`;
			recDiv.appendChild(senderText);
			
			// Add line break
			recDiv.appendChild(document.createElement('br'));
			
			// Create and add message text
			const messageText = document.createElement('span');
			messageText.textContent = data.message;
			recDiv.appendChild(messageText);
			const timeAndIcon = document.createElement('div');
			timeAndIcon.classList.add('timeAndIcon');
			timeAndIcon.style.display = 'flex';
			timeAndIcon.style.marginRight = 'auto';
			// Create a paragraph element for the date
			const dateParagraph = document.createElement('p');
			dateParagraph.textContent = formatDateComparison(data.time);  // Format and add the date
			dateParagraph.style.marginBottom = '0';
			// Append the date paragraph to the message div
			timeAndIcon.appendChild(dateParagraph);
			if (!data.store) {
				const cryptoIcon = document.createElement('i');
				cryptoIcon.classList.add('icon-user-secret');
				
				cryptoIcon.style.marginTop = 'auto';
				cryptoIcon.style.marginLeft = '3px';
				timeAndIcon.appendChild(cryptoIcon);    
			}
			
			
			recDiv.appendChild(timeAndIcon);
			
			// Append the message div to the chat container
			chat.appendChild(recDiv);
			
			// Scroll to the bottom of the chat
			chat.scrollTo({
				top: chat.scrollHeight,
				behavior: "smooth"
			});
		}
		else {
			let existingMessage = document.querySelector(`.unreadMessages[group="${data.groupOfMessage}"]`);
			
			// Check if the user's unread message div already exists
			if (!existingMessage) {
				// Create a new unread message div for the specific user
				const unreadMessage = document.createElement('div');
				unreadMessage.classList.add('unreadMessages');
				unreadMessage.setAttribute('value', '1'); // Set initial value to 1
				unreadMessage.setAttribute('group', data.groupOfMessage); // Set data-username for this user
				unreadMessage.textContent = `${data.groupName} 1`; // Display initial unread count
				
				// Append to the messages content
				document.getElementById("messagesContent").appendChild(unreadMessage);
			} else {
				// If the element exists, update its value
				let currentValue = parseInt(existingMessage.getAttribute('value'), 10) || 0; // Default to 0 if NaN
				currentValue++; // Increment the value
				
				// Set the new value and update displayed text
				existingMessage.setAttribute('value', currentValue);
				existingMessage.textContent = `${data.groupName} ${currentValue}`;
			}
			
			// Update the overall message counter
			let messageValue = parseInt(messCounter.getAttribute('value'), 10) || 0; // Default to 0 if NaN
			messageValue++;
			console.log(messageValue);
			messCounter.setAttribute('value', messageValue);
			messCounter.textContent = messageValue;    
		}
	});
	
	socket.on('groupMessages', (data) => {
		const { messages, groupAvatar, groupName, groupId, unreadGroupCount } = data;
		console.log(data);
		if (unreadGroupCount > 0) {
			// Select all divs with the class "yourClassName"
			document.querySelectorAll('.unreadMessages').forEach(div => {
				// Check if the attribute "data-attribute" has the desired value
				if (parseInt(div.getAttribute('group'), 10) == groupId) {
					// Remove the div if it matches the attribute value
					let messageValue = parseInt(messCounter.getAttribute('value'), 10) || 0; // Default to 0 if NaN
					messageValue -= parseInt(div.getAttribute('value'), 10);
					//console.log(messageValue);
					messCounter.setAttribute('value', messageValue);
					messCounter.textContent = messageValue; 
					//div.remove();
				}
			});
		}
		
		const receiverAvatar = document.getElementById('receiverAvatar');
		// Clear existing content in #receiverAvatar
		receiverAvatar.innerHTML = ''; 
		receiverAvatar.textContent = '';
		receiverElement.textContent = groupName;
 		
		if (groupAvatar) {
			// Check for the presence of an img element
			const img = document.createElement('img');
			img.id = 'receiverImg';
			img.src = groupAvatar;
			receiverAvatar.appendChild(img);
			
		}
		else {
			const initials = document.createElement('div');
			console.log('check');
			initials.id = 'receiverInitials';
			initials.textContent = groupName.charAt(0).toUpperCase();
			
			initials.classList.add('displayGroupInitials');
			initials.classList.remove('hideGroupInitials');
			receiverAvatar.appendChild(initials);
		}
		
		chat.innerHTML = '';
		
		messages.forEach(message => {
			
			if (message.senderName != username) {
				adjustMarginForScrollbar();
				
				// Create a div element for the message bubble
				const recDiv = document.createElement('div');
				recDiv.classList.add('bubble', 'right');
				recDiv.style.wordBreak = 'break-word';
				recDiv.textContent = '';
				
				// Create and add sender text
				const senderText = document.createElement('span');
				senderText.textContent = `${message.senderName}:`;
				recDiv.appendChild(senderText);
				
				// Add line break
				recDiv.appendChild(document.createElement('br'));
				
				// Create and add message text
				const messageText = document.createElement('span');
				messageText.textContent = message.message;
				recDiv.appendChild(messageText);
				const timeAndIcon = document.createElement('div');
				timeAndIcon.classList.add('timeAndIcon');
				timeAndIcon.style.display = 'flex';
				timeAndIcon.style.marginRight = 'auto';
				// Create a paragraph element for the date
				const dateParagraph = document.createElement('p');
				dateParagraph.textContent = formatDateComparison(message.sendTime);  // Format and add the date
				dateParagraph.style.marginBottom = '0';
				// Append the date paragraph to the message div
				timeAndIcon.appendChild(dateParagraph);
				if (message.store == 1) {
					const cryptoIcon = document.createElement('i');
					cryptoIcon.classList.add('icon-user-secret');
					
					cryptoIcon.style.marginTop = 'auto';
					cryptoIcon.style.marginLeft = '3px';
					timeAndIcon.appendChild(cryptoIcon);    
				}
				
				
				recDiv.appendChild(timeAndIcon);
				
				// Append the message div to the chat container
				chat.appendChild(recDiv);
				
				// Scroll to the bottom of the chat
				jQuery("#messageContainer").scrollTop(jQuery("#messageContainer")[0].scrollHeight);
			}
			else {
				const sendDiv = document.createElement('div');
				sendDiv.classList.add('bubble', 'left');
				sendDiv.style.wordBreak = 'break-word';
				sendDiv.textContent = message.message;  // Add the message text
				const timeAndIcon = document.createElement('div');
				timeAndIcon.classList.add('timeAndIcon');
				timeAndIcon.style.display = 'flex';
				timeAndIcon.style.marginLeft = 'auto';
				// Create a paragraph element for the date
				const dateParagraph = document.createElement('p');
				dateParagraph.textContent = `${formatDateComparison(message.sendTime)}`;
				dateParagraph.style.marginBottom = '0';
				dateParagraph.style.textAlign = 'right';
				if (message.store == 1) {
					const cryptoIcon = document.createElement('i');
					cryptoIcon.classList.add('icon-user-secret');
					cryptoIcon.style.marginRight = '3px';
					cryptoIcon.style.marginTop = 'auto';
					timeAndIcon.appendChild(cryptoIcon);    
				}
				timeAndIcon.appendChild(dateParagraph);
				sendDiv.appendChild(timeAndIcon);
				// Append the date paragraph to the message div
				//sendDiv.appendChild(dateParagraph);
				chat.appendChild(sendDiv);
				
				
				
				
				adjustMarginForScrollbar();
				jQuery("#messageContainer").scrollTop(jQuery("#messageContainer")[0].scrollHeight);
				
			}
			document.getElementById("messagesContent").addEventListener("transitionend", function(event) {
				const parent = event.target;
				const child = parent.querySelector(`[group="${groupId}"]`);
				if (child) {
					console.log("remove");
					child.remove();
					document.querySelectorAll('.dropdown-content').forEach(element => {
						element.classList.remove('hide');
					});
				}
			}, { once: true });    
		});
		if (data.type == 'button') document.querySelector(`.unreadMessages[group="${groupId}"]`)?.remove();
	});
	socket.on('disconnectedUserGroups', (data) => {
		
		console.log(data);
		const groupIds = data.map(groupData => groupData.groupId);
		
		// Select all SVG elements
		const svgElements = document.querySelectorAll('svg');
		
		// Loop through each SVG element
		svgElements.forEach(svg => {
			// Convert the 'group' attribute to a number for comparison
			const groupId = parseInt(svg.getAttribute('group'), 10);
			
			// Check if the groupId from the SVG matches any ID in the extracted groupIds array
			if (groupIds.includes(groupId)) {
				// Find the <circle> element inside this <svg>
				const circle = svg.querySelector('circle');
				
				// Change the fill color of the circle
				if (circle) {
					circle.setAttribute('fill', 'red');
				}
			}
		});
	});
	
	socket.on('group update', (data) => {
		
		console.log(data);
	});
	socket.on('invitationConfirmed', (data) => {
		console.log(data);
	});
	
	socket.on('userJoinedGroup', (data) => {
		console.log(data);
		const svgElements = document.querySelectorAll('svg');
		
		// Loop through each SVG element
		svgElements.forEach(svg => {
			// Check if the 'group' attribute matches the provided groupId
			if (svg.getAttribute('group') === data.groupId.toString()) {
				// Find the <circle> element inside this <svg>
				const circle = svg.querySelector('circle');
				
				// Change the fill color of the circle
				if (circle) {
					circle.setAttribute('fill', 'green');
				}
			}
		});
	});
	
	const groupsContainer = document.getElementById('groupsContainer');
	
	socket.on('group confirmed', (data) => {
		console.log(data);
		let children = document.querySelectorAll('.user');  // Select all children
		// Check if any child's 'data-id' attribute is NOT equal to the target value
		let groupExists = Array.from(children).some(child => 
			parseInt(child.getAttribute('groupid'), 10) == data.groupId
		);
		if (!groupExists) {
			
			const fragment = document.createDocumentFragment();
			const userDiv = document.createElement('div');
			userDiv.classList.add('user');
			userDiv.setAttribute('groupid', data.groupId);
			
			const profileContainer = document.createElement('div');
			profileContainer.classList.add('profile-container');
			
			// Create initials element but keep it hidden initially
			const initials = document.createElement('div');
			initials.classList.add('initials');
			initials.textContent = data.groupName.charAt(0).toUpperCase();
			profileContainer.appendChild(initials);
			
			userDiv.appendChild(profileContainer);
			
			const userInfoDiv = document.createElement('div');
			userInfoDiv.classList.add('user-info');
			userInfoDiv.style.width = '100px';
			const usernameText = document.createElement('div');
			usernameText.classList.add('username');
			usernameText.textContent = data.groupName;
			userInfoDiv.appendChild(usernameText);
			
			const buttonsDiv = document.createElement('div');
			buttonsDiv.classList.add('buttons');
			// Create send message button
			const svgNS = "http://www.w3.org/2000/svg";
			
			// Create the <svg> element
			const svgElement = document.createElementNS(svgNS, "svg");
			svgElement.setAttribute("width", "16");
			svgElement.setAttribute("height", "16");
			svgElement.setAttribute("group", data.groupId);
			svgElement.setAttribute('viewBox', '0 0 16 16');
			svgElement.classList.add('svg-circle')
			// Create the <circle> element
			const circle = document.createElementNS(svgNS, "circle");
			circle.setAttribute("cx", "8");
			circle.setAttribute("cy", "8");
			circle.setAttribute("r", "8");
			if (data.lineStatus == 1) circle.setAttribute("fill", "green");
			else circle.setAttribute("fill", "red");
			// Append the circle to the SVG
			svgElement.appendChild(circle);
			
			// Append the SVG to the parent container (e.g., div#svgContainer)
			profileContainer.appendChild(svgElement);
			const sendButton = document.createElement('button');
			sendButton.classList.add('send');
			sendButton.classList.add('toGroup');
			//sendButton.value = data.groupId;
			sendButton.dataset.groupId = data.groupId;
			sendButton.dataset.groupName = data.groupName;
			const sendIcon = document.createElement('i');
			sendIcon.classList.add('icon-chat');
			sendButton.appendChild(sendIcon);
			buttonsDiv.appendChild(sendButton);
			
			// Create block button
			const blockButton = document.createElement('button');
			blockButton.classList.add('block');
			blockButton.classList.add('quitGroup');
			blockButton.value = data.groupId;
			const blockIcon = document.createElement('i');
			blockIcon.classList.add('icon-block-1');
			blockButton.appendChild(blockIcon);
			buttonsDiv.appendChild(blockButton);
			
			// Append buttons to userInfoDiv
			userInfoDiv.appendChild(buttonsDiv);
			
			// Append userInfoDiv to userDiv
			userDiv.appendChild(userInfoDiv);
			fragment.appendChild(userDiv);
			
			const sendButtons = document.querySelectorAll('.send');
			sendButton.addEventListener('click', async () => {
				isTypingVisible = false;
				groupName = sendButton.dataset.groupName;
				group = sendButton.dataset.groupId;
				receiver = '';
				
				const groupId = group;
				const type = "button"
				socket.emit('requestGroupMessages', groupId, type);
							
				
				// Clear existing content in #receiverAvatar
				receiverAvatar.innerHTML = ''; 
				receiverAvatar.textContent = ''; 
				receiverElement.textContent = groupName;

				const profileContainer = userDiv.querySelector('.profile-container');
				
				// Check for the presence of an img element
				const img = profileContainer.querySelector('img.profile-image');
				const initialsElement = profileContainer.querySelector('.initials');
				
				// Append the image or initials based on availability
				if (img) {
					const clonedImg = img.cloneNode();
					clonedImg.classList.remove('profile-image');
					clonedImg.id = 'receiverImg';
					receiverAvatar.appendChild(clonedImg);
				} else if (initialsElement) {
					const clonedInitials = initialsElement.cloneNode(true);
					clonedInitials.classList.remove('initials');
					console.log('check');

					clonedInitials.id = 'receiverInitials';
					clonedInitials.classList.add('displayGroupInitials');
					clonedInitials.classList.remove('hideGroupInitials');
					receiverAvatar.appendChild(clonedInitials);
				}
			});
			
			blockButton.addEventListener('click', () => {
				blockButton.disabled = true;
				console.log("click");
				const blockedUser = blockButton.value;
				if (group == blockedUser) {
					group = null;
					receiver = '';
					receiverAvatar.innerHTML = ''; 
					receiverAvatar.textContent = ''; 
					receiverElement.textContent = '';
					chat.innerHTML = '';
				}
				const groupId = blockedUser;
				socket.emit('quit group', groupId);
				
				// Find and remove the nearest parent with class 'user'
				const userElement = blockButton.closest('.user');
				if (userElement) {
					userElement.remove();
				}
			});
			//1
			updateProfileImage(profileContainer, data.groupAvatar, initials);
			groupsContainer.appendChild(fragment);
		}
	});
	
	const groupCounter = document.getElementById('groupCounter');
	
	socket.on('groupInvites', (data) => {
		console.log(data);
		data.forEach(invite => {
			const invitation = document.createElement('div');
			invitation.classList.add('invitation');
			
			invitation.setAttribute('groupID', invite.groupId);
			invitation.setAttribute('groupName', invite.groupName);
			invitation.setAttribute('creator', invite.invitingUsername);
			invitation.textContent = `${invite.invitingUsername}`; // Display initial unread count
			
			// Append to the messages content
			document.getElementById("groupsContent").appendChild(invitation);
			let invitationValue = parseInt(groupCounter.getAttribute('value'), 10) || 0; // Default to 0 if NaN
			invitationValue++;
			console.log(invitationValue);
			groupCounter.setAttribute('value', invitationValue);
			groupCounter.textContent = invitationValue;
			document.getElementById("groupsContent").appendChild(invitation);
		})
	});
	
	socket.on('groupInvite', (data) => {
		console.log(data);
		signal.play();
		const invitation = document.createElement('div');
		invitation.classList.add('invitation');
		
		invitation.setAttribute('groupID', data.groupId);
		invitation.setAttribute('groupName', data.groupName);
		invitation.setAttribute('creator', data.creator); // Set data-username for this user
		invitation.textContent = `${data.creator}`; // Display initial unread count
		
		// Append to the messages content
		document.getElementById("groupsContent").appendChild(invitation);
		let invitationValue = parseInt(groupCounter.getAttribute('value'), 10) || 0; // Default to 0 if NaN
		invitationValue++;
		console.log(invitationValue);
		groupCounter.setAttribute('value', invitationValue);
		groupCounter.textContent = invitationValue;
		document.getElementById("groupsContent").appendChild(invitation);
	});
	
	function setEqualUserDivWidth() {
		const userDivs = document.querySelectorAll('.username');
		let maxWidth = 0;
		
		// Find the maximum width of all user-info divs
		userDivs.forEach(userInfoDiv => {
			const width = userInfoDiv.offsetWidth;
			if (width > maxWidth) {
				maxWidth = width;
			}
		});
		
		// Apply the maximum width to all user-info divs
		userDivs.forEach(userInfoDiv => {
			userInfoDiv.style.width = `${maxWidth}px`;
		});
	}
	
	// Named function for the socket event
	const handleFriendsToGroup = (data) => {
		let invited = []; // Initialize invited array on each call
		console.log(data);
		
		const modalContent = document.getElementById('friendsToGroup');
		modalContent.innerHTML = ''; // Clear previous content
		const friends = document.createElement('div');
		friends.id = "scrolledFriends";
		modalContent.appendChild(friends);
		if (data.length > 0) {
			// Create the .accountContentText div
			createGroupBtn.style.display = 'block';
			document.getElementById('groupMessage').textContent = 'Create New Group'
			const accountContentText = document.createElement('div');
			
			accountContentText.classList.add('accountContentText');
			const nameInput = document.createElement('input');
			
			// Set its attributes
			nameInput.type = 'text';
			nameInput.id = 'groupName';
			nameInput.placeholder = 'Enter Group Name';
			nameInput.style.height = '25px';
			
			modalContent.appendChild(nameInput);
			// Create the label and input (hidden)
			const label = document.createElement('label');
			label.setAttribute('for', 'groupAvatar');
			label.classList.add('custom-file-label');
			label.style.color = 'inherit';
			label.style.cursor = 'pointer';
			label.style.display = 'flex';
			label.style.justifyContent = 'space-between';
			label.style.alignItems = 'center';
			label.style.width = '100%';
			
			const span = document.createElement('span');
			span.textContent = 'Upload Avatar';
			span.style.fontSize = '20px';
			const iconContainer = document.createElement('div');
			iconContainer.classList.add('icon-upload-1', 'accIon');
			label.appendChild(span);
			label.appendChild(iconContainer);
			
			const input = document.createElement('input');
			input.type = 'file';
			input.id = 'groupAvatar';
			input.accept = 'image/*';
			input.style.display = 'none';
			
			accountContentText.appendChild(label);
			accountContentText.appendChild(input);
			modalContent.appendChild(accountContentText);
			
			const fragment = document.createDocumentFragment();
			
			// Create user divs for each friend
			data.forEach((friend) => {
				const userDiv = document.createElement('div');
				//const friends = document.getElementById('friends')
				userDiv.classList.add('user');
				userDiv.style.flexGrow = '1';
				const profileContainer = document.createElement('div');
				profileContainer.classList.add('profile-container');
				
				const initials = document.createElement('div');
				initials.classList.add('initials');
				initials.textContent = friend.name.charAt(0).toUpperCase();
				profileContainer.appendChild(initials);
				
				userDiv.appendChild(profileContainer);
				
				const userInfoDiv = document.createElement('div');
				userInfoDiv.classList.add('user-info');
				// userInfoDiv.style.minWidth = '100px';
				const usernameText = document.createElement('div');
				usernameText.classList.add('username');
				usernameText.style.flex = '1';
				usernameText.style.minWidth = '0';
				usernameText.textContent = friend.name;
				userInfoDiv.appendChild(usernameText);
				
				const checkbox = document.createElement('input'); // Create the checkbox
				checkbox.setAttribute('type', 'checkbox');
				checkbox.className = 'checkbox';
				
				userDiv.appendChild(userInfoDiv);
				userDiv.appendChild(checkbox);
				friends.appendChild(userDiv)
				fragment.appendChild(friends);
				
				updateProfileImage(profileContainer, friend.image, initials);

				
			});
			
			modalContent.appendChild(fragment);
			
			// Manage invited users and checkboxes
			const checkboxes = document.querySelectorAll('.checkbox');
			
			// Clear previous event listeners (if any) and set up new listeners
			checkboxes.forEach((checkbox) => {
				checkbox.removeEventListener('change', checkbox.changeListener); // Clear previous listeners
				
				const changeListener = function () {
					const textContent = this.previousElementSibling.textContent;
					
					if (this.checked) {
						invited.push(textContent);
						checkConditions() // Add to invited
					} else {
						invited = invited.filter(item => item !== textContent);
						checkConditions() // Remove from invited
					}
					console.log(invited);
				};
				
				checkbox.changeListener = changeListener; // Save the listener function
				checkbox.addEventListener('change', changeListener);
			});
			
			// File input listener
			input.addEventListener('change', () => {
				const file = input.files[0];
				const maxFileSize = 10 * 1024 * 1024; // 1 MB in bytes
				if (file.size > maxFileSize) {
					alert(`File is too large. Max size is ${maxFileSize / 1024 / 1024} MB`);
					console.error(`File is too large. Max size is ${maxFileSize / 1024 / 1024} MB`);
					return;
				}
				if (!file) {
					console.error('No file selected!');
					avatar = null; // Reset avatar if no file is selected
					return;
				}
				
				const reader = new FileReader();
				reader.onload = function (event) {
					avatar = {
						imageData: event.target.result.split(',')[1], // Get the base64 encoded part
						fileType: file.type // Image type
					};
					console.log('Avatar updated', avatar); // Ensure avatar is updated correctly
				};
				
				reader.readAsDataURL(file);
			});
			
			// Ensure the click handler for sending the group is only added once
			const sendGroupButton = document.getElementById("sendGroup");
			sendGroupButton.removeEventListener('click', sendGroupButton.clickListener); // Clear previous listeners
			const clickListener = () => {
				if (!avatar) {
					avatar = null; // Explicitly set avatar to null if no avatar uploaded
				}
				console.log(invited);
				const groupName = document.getElementById('groupName').value;
				socket.emit('createGroup', { groupName, invited, username, avatar });
				
				// Reset avatar after group creation
				avatar = null;
			};
			
			sendGroupButton.clickListener = clickListener; // Save the listener function
			sendGroupButton.addEventListener('click', clickListener);
			function checkConditions() {
				const inputValue = nameInput.value.trim(); // Trim spaces
				
				// Check if input is not empty and array length is greater than 0
				if (inputValue.length > 0 && invited.length > 0) {
					createGroupBtn.style.opacity = '1';
					createGroupBtn.disabled = false;
					
					console.log("block");
				} else {
					createGroupBtn.style.opacity = '0.5';
					createGroupBtn.disabled = true; // Hide the button
					console.log("none");
				}
			}
			
			// Event listener for typing in input
			nameInput.addEventListener('input', checkConditions);
			setEqualUserDivWidth();
		}
		else document.getElementById('groupMessage').textContent = 'You don’t have any friends added yet. Add some friends first to create a group';
	};
	
	socket.on('groupCreated', ({ groupId, groupName }) => {
		console.log("created");
		
		// Update the group message and hide the 'createGroup' element
		
		const createGroupElement = document.getElementById('createGroup');
		createGroupElement.classList.remove('show');
		document.getElementById('friendsToGroup').innerHTML = '';
		
		// Add the transitionend listener to execute actions after the transition ends
		const handleTransitionEnd = (event) => {
			
			console.log('Transition completed');
			document.getElementById('groupMessage').textContent = 'Group successfully created!';
			// Perform actions after the transition ends
			createGroupElement.classList.add('show');
			
			// Remove the event listener after it's been triggered to avoid duplicate executions
			createGroupElement.removeEventListener('transitionend', handleTransitionEnd);
			
		};
		
		// Add the transitionend event listener
		createGroupElement.addEventListener("transitionend", handleTransitionEnd);
		
		// Update the button styles and disable it
		const createGroupBtn = document.getElementById('sendGroup');
		createGroupBtn.style.display = 'none';
		createGroupBtn.style.opacity = '0.5';
		createGroupBtn.disabled = true;
	});
	
	// Ensure the event handler is only registered once
	socket.off('friendsToGroup'); // Remove any existing listeners for this event
	socket.on('friendsToGroup', handleFriendsToGroup);
	
	// Function to load the image asynchronously
	async function loadImageAsync(src) {
		const img = new Image();
		img.src = src;

		// Create a Promise to load the image
		return new Promise((resolve, reject) => {
			img.onload = async () => {
				try {
					if (!img.complete) {
						// Ensure that the image is completely loaded
						await img.decode();
					}
					resolve(img); // Resolve with the img object
				} catch (error) {
					reject(new Error(`Image decode failed: ${src}`)); // Reject if decoding fails
				}
			};

			img.onerror = () => reject(new Error(`Image failed to load: ${src}`)); // Reject on error
		});
	}

	// Function to update the profile image
	async function updateProfileImage(container, imageSrc, initials) {
		if (!imageSrc) {
			initials.style.display = 'flex'; // Show initials if no image
			return;
		}

		try {
			const img = await loadImageAsync(imageSrc); // Await the image loading
			console.log('Image loaded:', img);
			
			// Apply styles and append the image
			img.style.width = '40px';
			img.style.height = '40px';
			img.style.borderRadius = '50%';
			img.classList.add('userAvatar');
			container.appendChild(img); // Append the image to the container
		} catch (error) {
			console.error(error.message); // Log any error that occurs
			initials.style.display = 'flex'; // Show initials if the image fails to load
		}
	}

	
	
	const invCounter = document.getElementById('invCounter');
	
	socket.on('pendingInvitations', (pendingInvitations) => {
		let newMessageCntr = 0;
		pendingInvitations.forEach(newMessage => {
			const invitation = document.createElement('div');
			invitation.classList.add('invitation');
			
			invitation.setAttribute('data-username', newMessage.username); // Set data-username for this user
			invitation.textContent = `${newMessage.username}`; // Display initial unread count
			
			// Append to the messages content
			document.getElementById("invitationContent").appendChild(invitation);
			let invitationValue = parseInt(invCounter.getAttribute('value'), 10) || 0; // Default to 0 if NaN
			invitationValue++;
			console.log(invitationValue);
			invCounter.setAttribute('value', invitationValue);
			invCounter.textContent = invitationValue;
			document.getElementById("invitationContent").appendChild(invitation);
			
		});
	});
	
	const friendsContainer = document.getElementById('friendsContainer');
	
	socket.on('friendsList', (data) => {
		console.log(data);
		// Clear previous user list
		friendsContainer.innerHTML = ''; 
		
		const fragment = document.createDocumentFragment();
		
		// Loop over the found users
		data.forEach((friend) => {
			const userDiv = document.createElement('div');
			userDiv.classList.add('user');
			userDiv.classList.add('friends');
			const profileContainer = document.createElement('div');
			profileContainer.classList.add('profile-container');
			userDiv.appendChild(profileContainer);

			// Create initials element but keep it hidden initially
			const initials = document.createElement('div');
			initials.classList.add('initials');
			initials.textContent = friend.name.charAt(0).toUpperCase();
			profileContainer.appendChild(initials);
			
			const userInfoDiv = document.createElement('div');
			userInfoDiv.classList.add('user-info');
			userInfoDiv.style.width = '100px';
			const usernameText = document.createElement('div');
			usernameText.classList.add('username');
			usernameText.textContent = friend.name;
			userInfoDiv.appendChild(usernameText);
			
			const buttonsDiv = document.createElement('div');
			buttonsDiv.classList.add('buttons');
			// Create send message button
			const svgNS = "http://www.w3.org/2000/svg";
			
			// Create the <svg> element
			const svgElement = document.createElementNS(svgNS, "svg");
			svgElement.setAttribute("width", "16");
			svgElement.setAttribute("height", "16");
			svgElement.setAttribute('viewBox', '0 0 16 16');
			svgElement.classList.add('svg-circle')
			// Create the <circle> element
			const circle = document.createElementNS(svgNS, "circle");
			circle.setAttribute("cx", "8");
			circle.setAttribute("cy", "8");
			circle.setAttribute("r", "8");
			if(friend.online == 1) circle.setAttribute("fill", "green");
			else circle.setAttribute("fill", "red");
			// Append the circle to the SVG
			svgElement.appendChild(circle);
			
			// Append the SVG to the parent container (e.g., div#svgContainer)
			profileContainer.appendChild(svgElement);
			const sendButton = document.createElement('button');
			sendButton.classList.add('send');
			sendButton.value = friend.name;
			const sendIcon = document.createElement('i');
			sendIcon.classList.add('icon-chat');
			sendButton.appendChild(sendIcon);
			buttonsDiv.appendChild(sendButton);
			
			// Create block button
			const blockButton = document.createElement('button');
			blockButton.classList.add('block');
			blockButton.value = friend.name;
			const blockIcon = document.createElement('i');
			blockIcon.classList.add('icon-block-1');
			blockButton.appendChild(blockIcon);
			buttonsDiv.appendChild(blockButton);
			
			// Append buttons to userInfoDiv
			userInfoDiv.appendChild(buttonsDiv);
			
			// Append userInfoDiv to userDiv
			userDiv.appendChild(userInfoDiv);
			fragment.appendChild(userDiv);
			
			sendButton.addEventListener('click', async () => {
				isTypingVisible = false;
				receiver = sendButton.value;
				group = null;
				// Clear existing content in #receiverAvatar
				receiverAvatar.innerHTML = ''; 
				receiverAvatar.textContent = '';
				receiverElement.textContent = receiver;
 
				const profileContainer = userDiv.querySelector('.profile-container');
				console.log('profileContainer', profileContainer);

				// Check for the presence of an img element
				const img = profileContainer.querySelector('img.profile-image');
				const initialsElement = profileContainer.querySelector('.initials');
				console.log('img', img);
				// Append the image or initials based on availability
				if (profileContainer.contains(profileContainer?.querySelector('img'))) {
					const userAvatar = document.createElement('img');
					userAvatar.style.width = '100%';
					userAvatar.style.height = '100%';
					userAvatar.src = profileContainer?.querySelector('img').src;
					userAvatar.id = 'avatar';
					//receiverAvatar.appendChild(userAvatar);
				} else if (initialsElement) {
					const clonedInitials = initialsElement.cloneNode(true);
					clonedInitials.classList.remove('initials');
					clonedInitials.id = 'receiverInitials';
					console.log('check');

					clonedInitials.style.display = 'flex';
					receiverAvatar.appendChild(clonedInitials);
				}
				
				const messagesReqtype = 'button';
				
				socket.emit('sendMeMessages', username, receiver, messagesReqtype);
			});
			
			// Select all elements with the class 'send'
			const sendButtons = document.querySelectorAll('.send');
			
			blockButton.addEventListener('click', () => {
				blockButton.disabled = true;
				console.log("click");
				const blockedUser = blockButton.value;
				if (receiver == blockedUser) {
					receiver = '';
					receiverAvatar.innerHTML = ''; 
					receiverAvatar.textContent = ''; 
					receiverElement.textContent = '';
					chat.innerHTML = '';
				}
				socket.emit('block', blockedUser, (response) => {
					if (response.success) {
						socket.emit('findUsers', searchUser);
						console.log(response.message);
					} else {
						console.error('Failed to block user:', response.error);
					}
				});
			});
			
			//3
			updateProfileImage(profileContainer, friend.image, initials);

		});
		friendsContainer.appendChild(fragment);
	});
	
	socket.on('unread message counts', (unreadCounts) => {
		
		unreadCounts.forEach(newMessage => {
			const unreadMessage = document.createElement('div');
			unreadMessage.classList.add('unreadMessages');
			unreadMessage.setAttribute('value', `${newMessage.unreadCount}`);
			unreadMessage.setAttribute('data-username', newMessage.username); // Set data-username for this user
			unreadMessage.textContent = `${newMessage.username} ${newMessage.unreadCount}`;
			document.getElementById("messagesContent").appendChild(unreadMessage);
			newMessageCntr += newMessage.unreadCount// Set initial value to 1    
		});
		messCounter.setAttribute('value', newMessageCntr);
		messCounter.textContent = newMessageCntr;
	});
	
	socket.on('blockedNotification', (data) => {
		console.log(data);
		if (receiver == data) {
			receiver = '';
			receiverAvatar.innerHTML = ''; 
			receiverAvatar.textContent = ''; 
			receiverElement.textContent = '';
			chat.innerHTML = '';
		}
		socket.emit('findUsers', searchUser);
		socket.emit('give me friends to group', username);
	});
	socket.on('acceptedGroupInvites', (data) => {
		console.log(data);
		
		const fragment = document.createDocumentFragment();
		
		// Loop over the found users
		data.forEach((Mygroup) => {
			const userDiv = document.createElement('div');
			userDiv.classList.add('user');
			
			const profileContainer = document.createElement('div');
			profileContainer.classList.add('profile-container');
			
			// Create initials element but keep it hidden initially
			const initials = document.createElement('div');
			initials.classList.add('initials');
			initials.textContent = Mygroup.groupName.charAt(0).toUpperCase();
			profileContainer.appendChild(initials);
			
			userDiv.appendChild(profileContainer);
			
			const userInfoDiv = document.createElement('div');
			userInfoDiv.classList.add('user-info');
			userInfoDiv.style.width = '100px';
			const usernameText = document.createElement('div');
			usernameText.classList.add('username');
			usernameText.textContent = Mygroup.groupName;
			userInfoDiv.appendChild(usernameText);
			
			
			const buttonsDiv = document.createElement('div');
			buttonsDiv.classList.add('buttons');
			// Create send message button
			const svgNS = "http://www.w3.org/2000/svg";
			
			// Create the <svg> element
			const svgElement = document.createElementNS(svgNS, "svg");
			svgElement.setAttribute("width", "16");
			svgElement.setAttribute("height", "16");
			svgElement.setAttribute("group", Mygroup.groupId);
			svgElement.classList.add('svg-circle')
			// Create the <circle> element
			const circle = document.createElementNS(svgNS, "circle");
			circle.setAttribute("cx", "8");
			circle.setAttribute("cy", "8");
			circle.setAttribute("r", "8");
			if (Mygroup.online == 1) circle.setAttribute("fill", "green");
			else circle.setAttribute("fill", "red");
			// Append the circle to the SVG
			svgElement.appendChild(circle);
			
			// Append the SVG to the parent container (e.g., div#svgContainer)
			profileContainer.appendChild(svgElement);
			const sendButton = document.createElement('button');
			sendButton.classList.add('send');
			sendButton.dataset.groupId = Mygroup.groupId;
			sendButton.dataset.groupName = Mygroup.groupName;
			const sendIcon = document.createElement('i');
			sendIcon.classList.add('icon-chat');
			sendButton.appendChild(sendIcon);
			buttonsDiv.appendChild(sendButton);
			
			// Create block button
			const blockButton = document.createElement('button');
			blockButton.classList.add('block');
			blockButton.value = Mygroup.groupId;
			const blockIcon = document.createElement('i');
			blockIcon.classList.add('icon-block-1');
			blockButton.appendChild(blockIcon);
			buttonsDiv.appendChild(blockButton);
			
			// Append buttons to userInfoDiv
			userInfoDiv.appendChild(buttonsDiv);
			
			// Append userInfoDiv to userDiv
			userDiv.appendChild(userInfoDiv);
			fragment.appendChild(userDiv);
			
			sendButton.addEventListener('click', async () => {
				isTypingVisible = false;
				receiver = '';
				group = sendButton.dataset.groupId;
				const groupId = sendButton.dataset.groupId;
				const type = "button";
				socket.emit('requestGroupMessages', groupId, type);
				
				
			});
			
			// Select all elements with the class 'send'
			const sendButtons = document.querySelectorAll('.send');
			
			blockButton.addEventListener('click', () => {
				blockButton.disabled = true;
				console.log("click");
				const blockedUser = blockButton.value;
				if (group == blockedUser) {
					//group = null;
					receiverAvatar.innerHTML = ''; 
					receiverAvatar.textContent = ''; 
					receiverElement.textContent = '';
					chat.innerHTML = '';
				}
				
				const groupId = blockedUser;
				socket.emit('quit group', groupId);
				
				const userElement = blockButton.closest('.user');
				if (userElement) {
					userElement.remove();
				}
			});
			//4
			updateProfileImage(profileContainer, Mygroup.groupAvatar, initials);

			
		});
		groupsContainer.appendChild(fragment);
	});
	
	socket.on('user info', ({ id, profileImage }) => {
		console.log(`User ID: ${id}`);
		if (profileImage != null && document.getElementById("initials")) document.getElementById("initials").remove();
		
		// Check if profile image exists
		if (profileImage) {
			
			const avatarContainer = document.getElementById("avatarOrInitials");
			const existingAvatar = document.getElementById('avatar');
			const avatar = document.createElement('div');
			avatar.id = 'avatar';
			avatarContainer.appendChild(avatar);
			
			const img = new Image();
			img.src = profileImage; // Use the emitted profile image path
			img.style.width = '100%';
			img.style.height = '100%';
			img.style.borderRadius = '50%';
			img.style.objectFit = 'cover';
			
			avatar.appendChild(img);
		} else {
			// Handle the case where there's no profile image
			console.log('No profile image found.');
			// Optionally show a placeholder or initials
		}
	});
	
	socket.on('avatar', (relativePath) => {
		const divToRemove = document.getElementById('initials');
		const divToRemove1 = document.getElementById('avatar');
		if (divToRemove) divToRemove.remove();
		if (divToRemove1) divToRemove1.remove();    
		// Removes the div from the DOM
		const avatar = document.createElement('div');
		avatar.id = 'avatar';
		document.getElementById("avatarOrInitials").appendChild(avatar);
		
		const img = new Image();
		img.src = relativePath;
		
		// Set styles for the image
		img.style.width = '100%'; // Make the image fill the div
		img.style.height = '100%'; // Make the image fill the div
		img.style.borderRadius = '50%'; // Apply border radius to the image
		img.style.objectFit = 'cover'; // Optional: cover the div while maintaining aspect ratio
		
		avatar.appendChild(img);
		
	});
	
	const searchInput = document.getElementById('searchInput');
	const usersDiv = document.getElementById('users');
	let searchUser = '';
	
	searchInput.addEventListener('input', () => {
		searchUser = searchInput.value.trim();
		if (searchUser) {
			console.log('Input search user:', searchUser);
			socket.emit('findUsers', searchUser);
		} else {
			usersDiv.innerHTML = '';
		}
	});
	
	
	
	// Listen for 'foundUsers' event
	socket.on('inviteProcessed', () => {
		socket.emit('findUsers', searchUser);
		console.log('Find users after invite:', searchUser);
	});
	socket.on('foundUsers', async (founded) => {
		console.log('Found users:', founded);
		
		// Clear previous user list
		usersDiv.innerHTML = ''; // Clear the previous list
		
		const fragment = document.createDocumentFragment();
		
		// Loop over the found users
		founded.forEach((user) => {
			const userDiv = document.createElement('div');
			userDiv.classList.add('user');
			
			const profileContainer = document.createElement('div');
			profileContainer.classList.add('profile-container');
			
			// Create initials element but keep it hidden initially
			const initials = document.createElement('div');
			initials.classList.add('initials');
			initials.textContent = user.username.charAt(0).toUpperCase();
			profileContainer.appendChild(initials);
			
			userDiv.appendChild(profileContainer);
			
			const userInfoDiv = document.createElement('div');
			userInfoDiv.classList.add('user-info');
			userInfoDiv.style.width = '100px';
			const usernameText = document.createElement('div');
			usernameText.classList.add('username');
			usernameText.textContent = user.username;
			userInfoDiv.appendChild(usernameText);
			
			const buttonsDiv = document.createElement('div');
			buttonsDiv.classList.add('buttons');
			// Create buttons and append to buttonsDiv...
			const inviteButton = document.createElement('button');
			inviteButton.classList.add('invite');
			inviteButton.value = user.username;
			const inviteIcon = document.createElement('i');
			inviteIcon.classList.add('icon-user-plus');
			inviteButton.appendChild(inviteIcon);
			if (user.isFriend != 1) buttonsDiv.appendChild(inviteButton);
			
			// Create send message button
			const sendButton = document.createElement('button');
			sendButton.classList.add('send');
			sendButton.value = user.username;
			const sendIcon = document.createElement('i');
			sendIcon.classList.add('icon-chat');
			sendButton.appendChild(sendIcon);
			buttonsDiv.appendChild(sendButton);
			
			// Create block button
			const blockButton = document.createElement('button');
			blockButton.classList.add('block');
			blockButton.value = user.username;
			const blockIcon = document.createElement('i');
			blockIcon.classList.add('icon-block-1');
			blockButton.appendChild(blockIcon);
			buttonsDiv.appendChild(blockButton);
			
			// Append buttons to userInfoDiv
			userInfoDiv.appendChild(buttonsDiv);
			
			// Append userInfoDiv to userDiv
			userDiv.appendChild(userInfoDiv);
			fragment.appendChild(userDiv);
			
			sendButton.addEventListener('click', async () => {
				isTypingVisible = false;
				receiver = sendButton.value;
				group = null;
				
				// Clear existing content in #receiverAvatar
				receiverAvatar.innerHTML = ''; 
				receiverAvatar.textContent = ''; 
				receiverAvatar.textContent = ''; 

				receiverElement.textContent = receiver;						
				const profileContainer = userDiv.querySelector('.profile-container');
				console.log(profileContainer);
				if (profileContainer) {
					const img = profileContainer.querySelector('img.profile-image');
					const initialsElement = profileContainer.querySelector('.initials');
					console.log('img', img)
					console.log('initialsElement', initialsElement)
					if (img) {
						const clonedImg = img.cloneNode();
						clonedImg.classList.remove('profile-image');
						clonedImg.id = 'receiverImg';
						receiverAvatar.appendChild(clonedImg);
					} else if (initialsElement) {
						const clonedInitials = initialsElement.cloneNode(true);
						clonedInitials.style.visibility = 'hidden';
						console.log('clonedInitials', clonedInitials)
						clonedInitials.id = 'receiverInitials';
						console.log('check');

						clonedInitials.style.display = 'flex';
						receiverAvatar.appendChild(clonedInitials);
					}
				} else {
					console.warn('Profile container not found.');
				}
				const messagesReqtype = 'button';
				socket.emit('sendMeMessages', username, receiver, messagesReqtype);
			});
			
			// Select all elements with the class 'send'
			const sendButtons = document.querySelectorAll('.send');
			
			blockButton.addEventListener('click', () => {
				blockButton.disabled = true; 
				const blockedUser = blockButton.value;
				if (receiver == blockedUser) {
					receiver = '';
					receiverAvatar.innerHTML = ''; 
					receiverAvatar.textContent = ''; 
					receiverElement.textContent = '';
					chat.innerHTML = '';
				}
				socket.emit('block', blockedUser, (response) => {
					if (response.success) {
						socket.emit('findUsers', searchUser);
						console.log(response.message);
					} else {
						console.error('Failed to block user:', response.error);
					}
				});
			});
			inviteButton.addEventListener('click', () => {
				const invitedUser = inviteButton.value;
				console.log('Inviting user:', invitedUser); 
				inviteButton.disabled = true; // Disable button to prevent multiple invites
				socket.emit('invite', invitedUser);
			});
			
			updateProfileImage(profileContainer, user.profileImage, initials);
		});
		
		usersDiv.appendChild(fragment);
	});
	
	socket.on('message', (data) => {
		console.log(data);
		signal.play();
		// Handle message from the receiver
		if (data.user === receiver) {
			handleIncomingMessage(data);
		} else {
			handleOtherMessage(data.user);
		}
	});
	
	function handleIncomingMessage(message) {
		isTypingVisible = false;
		adjustMarginForScrollbar();
		document.getElementById('dots').remove();
		// Create a div element for the message bubble
		const recDiv = document.createElement('div');
		recDiv.classList.add('bubble', 'right');
		recDiv.style.wordBreak = 'break-word';
		recDiv.textContent = message.message;  // Add the message text
		const timeAndIcon = document.createElement('div');
		timeAndIcon.classList.add('timeAndIcon');
		timeAndIcon.style.display = 'flex';
		timeAndIcon.style.marginRight = 'auto';
		// Create a paragraph element for the date
		const dateParagraph = document.createElement('p');
		dateParagraph.textContent = formatDateComparison(message.date);  // Format and add the date
		dateParagraph.style.marginBottom = '0';
		// Append the date paragraph to the message div
		timeAndIcon.appendChild(dateParagraph);
		if(!message.store) {
			const cryptoIcon = document.createElement('i');
			cryptoIcon.classList.add('icon-user-secret');
			
			cryptoIcon.style.marginTop = 'auto';
			cryptoIcon.style.marginLeft = '3px';
			timeAndIcon.appendChild(cryptoIcon);    
		}
		
		
		recDiv.appendChild(timeAndIcon);
		
		// Append the message div to the chat container
		chat.appendChild(recDiv);
		
		// Scroll to the bottom of the chat
		chat.scrollTo({
			top: chat.scrollHeight,
			behavior: "smooth"
		});	}
	
	function formatDateComparison(targetDate) {
		const now = new Date();
		targetDate = new Date(targetDate);  // Convert the string to a Date object
		
		// Extract day, month, and year from both dates
		const nowDay = now.getDate();
		const nowMonth = now.getMonth();
		const nowYear = now.getFullYear();
		
		const targetDay = targetDate.getDate();
		const targetMonth = targetDate.getMonth();
		const targetYear = targetDate.getFullYear();
		
		// Compare day, month, and year
		if (nowDay === targetDay && nowMonth === targetMonth && nowYear === targetYear) {
			// If same, return hours and minutes
			const hours = targetDate.getHours();
			const minutes = targetDate.getMinutes();
			return `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}`; // Add leading zero to minutes if needed
		} else {
			// If different, return full date in "year-month-day" format
			return `${targetYear}.${(targetMonth + 1).toString().padStart(2, '0')}.${targetDay.toString().padStart(2, '0')}`;
		}
	}
	
	// Main function for handling new messages
	function handleOtherMessage(user) {
		// Use a selector to check if there's a div with data-username matching the user
		let existingMessage = document.querySelector(`.unreadMessages[data-username="${user}"]`);
		
		// Check if the user's unread message div already exists
		if (!existingMessage) {
			// Create a new unread message div for the specific user
			const unreadMessage = document.createElement('div');
			unreadMessage.classList.add('unreadMessages');
			unreadMessage.setAttribute('value', '1'); // Set initial value to 1
			unreadMessage.setAttribute('data-username', user); // Set data-username for this user
			unreadMessage.textContent = `${user} 1`; // Display initial unread count
			
			// Append to the messages content
			document.getElementById("messagesContent").appendChild(unreadMessage);
		} else {
			// If the element exists, update its value
			let currentValue = parseInt(existingMessage.getAttribute('value'), 10) || 0; // Default to 0 if NaN
			currentValue++; // Increment the value
			
			// Set the new value and update displayed text
			existingMessage.setAttribute('value', currentValue);
			existingMessage.textContent = `${user} ${currentValue}`;
		}
		
		// Update the overall message counter
		let messageValue = parseInt(messCounter.getAttribute('value'), 10) || 0; // Default to 0 if NaN
		messageValue++;
		console.log(messageValue);
		messCounter.setAttribute('value', messageValue);
		messCounter.textContent = messageValue;
	}
	
	// Attach the global click event listener to the parent container
	const messagesContent = document.getElementById("messagesContent");
	
	messagesContent.addEventListener('click', (event) => {
		const unreadMessage = event.target.closest('.unreadMessages');
		if (!unreadMessage) return; // Stop if not an unread message
		
		// Hide dropdown menu and reset after transition
		const dropdownContent = document.querySelector('.dropdown-content');
		dropdownContent.classList.add('hide');
		dropdownContent.classList.remove('active');
		
		// Check if the element has `data-username` or `group` attributes and handle accordingly
		if (unreadMessage.hasAttribute('data-username')) {
			isTypingVisible = false;
			receiver = unreadMessage.getAttribute('data-username');
			console.log('Clicked username:', receiver);
			
			group = null;
			const messagesReqtype = 'menu';
			socket.emit('sendMeMessages', username, receiver, messagesReqtype);
		} else if (unreadMessage.hasAttribute('group')) {
			const groupId = unreadMessage.getAttribute('group');
			console.log('Clicked group:', groupId);
			isTypingVisible = false;
			receiver = '';
			group = groupId;
			const type = "menu";
			socket.emit('requestGroupMessages', groupId, type);
		}
	});
	
	// Define the common function to handle clicks
	function confirmInvitation(contentType, event, emitType, cntr) {
		const element = event.target.closest('.invitation');
		
		if (element) {
			// Log the data-username or data-groupname attribute based on contentType
			const nameAttr = contentType === 'invitation' ? 'data-username' : 'groupID';
			const nameValue = element.getAttribute(nameAttr);
			console.log(`Clicked ${contentType}:`, nameValue);
			let gruopName = null;
			let groupInvitingName = null;
			if (contentType != 'invitation') {
				gruopName = element.getAttribute('groupName');
				groupInvitingName = element.getAttribute('creator');
			}
			// Prompt the user with the confirm modal
			customConfirm(nameValue, cntr, gruopName, groupInvitingName)
			.then((response) => {
				if (response === 'yes') {
					// Remove the clicked element from the DOM
					element.remove();
					
					// Emit the decision through WebSocket with custom event and data
					socket.emit(emitType, { decision: true, invitingName: nameValue });
				} else if (response === 'no') {
					element.remove();
					
					// Emit the decision through WebSocket with custom event and data
					socket.emit(emitType, { decision: false, invitingName: nameValue });
				}
			});
		}
	}
	
	// Add event listeners with the custom function for invitations
	invitationContent.addEventListener('click', (event) => {
		confirmInvitation('invitation', event, 'confirm invite', 'invCounter');
	});
	
	// Add event listeners with the custom function for groups
	document.getElementById("groupsContent").addEventListener('click', (event) => {
		console.log("click");
		confirmInvitation('group', event, 'confirm group', 'groupCounter');
	});
	
	socket.on('send invitation', (data) => {
		
		// Create a new unread message div for the specific user
		const invitation = document.createElement('div');
		invitation.classList.add('invitation');
		
		invitation.setAttribute('data-username', data.from); // Set data-username for this user
		invitation.textContent = `${data.from}`; // Display initial unread count
		
		// Append to the messages content
		document.getElementById("invitationContent").appendChild(invitation);
		let invitationValue = parseInt(invCounter.getAttribute('value'), 10) || 0; // Default to 0 if NaN
		invitationValue++;
		console.log(invitationValue);
		invCounter.setAttribute('value', invitationValue);
		invCounter.textContent = invitationValue;
		document.getElementById("invitationContent").appendChild(invitation);
		
	});
	
	const userAvatar = document.getElementById('userAvatar'); // Replace with your file input element's ID
	
	// HTML file input event listener
	userAvatar.addEventListener('change', () => {
		const file = userAvatar.files[0];
		
		// Check if a file is selected
		if (!file) {
			console.error('No file selected!');
			return;
		}
		
		// Valid MIME types for common image formats
		const validMimeTypes = [
			'image/jpeg', 'image/jpg', 'image/png', 
			'image/gif', 'image/bmp', 'image/svg+xml', 
			'image/webp'
		];
		
		// Check file type
		if (!validMimeTypes.includes(file.type)) {
			console.error('Unsupported file type:', file.type);
			return;
		}
		
		// Maximum allowed file size (1 MB for example)
		const maxFileSize = 10 * 1024 * 1024; // 1 MB in bytes
		if (file.size > maxFileSize) {
			alert(`File is too large. Max size is ${maxFileSize / 1024 / 1024} MB`);
			console.error(`File is too large. Max size is ${maxFileSize / 1024 / 1024} MB`);
			return;
		}
		
		const reader = new FileReader();
		reader.onload = function(event) {
			const imageData = event.target.result;
			console.log('Image data prepared, emitting...');
			
			// Emit the file data and file type
			socket.emit('uploadImage', {
				imageData: imageData.split(',')[1], // Base64 data without prefix
				fileType: file.type
			});
		};
		
		reader.readAsDataURL(file);
	});
	
	const currentUsername = localStorage.getItem('username'); // Get the current user's username
	
	document.getElementById("initials").textContent = currentUsername.charAt(0).toUpperCase();
	const messageInput = document.getElementById('message');
	let typingTimer;
	let typingDelay = 2000; // Set a delay for stopping typing event (in ms)
	
	let typingIndicator = null; // To track the current typing indicator
	let typingBubble = null; // To track the current typing bubble
	
	// Handle input event for typing
	messageInput.addEventListener('input', () => {
		console.log("type");
		console.log(receiver);
		
		// Ensure receiver is set before emitting typing event
		if (receiver) {
			socket.emit('typing', true, receiver); // Notify server that user is typing
		}
		
		// Clear the previous typing timer
		clearTimeout(typingTimer);
		
		// Set a new timer to emit typing stopped after delay
		typingTimer = setTimeout(() => {
			if (receiver) {
				socket.emit('typing', false, receiver); // Notify server that user stopped typing
			}
		}, typingDelay);
	});
	
	function createTypingIndicator() {
		const typingIndicator = document.createElement('div');
		typingIndicator.classList.add('typing-indicator');
		typingIndicator.style.display = 'flex';
		typingIndicator.style.justifyContent = 'center';
		typingIndicator.style.alignItems = 'center';
		typingIndicator.style.gap = '5px';
		typingIndicator.style.padding = '10px';
		
		for (let i = 0; i < 3; i++) {
			const dot = document.createElement('span');
			dot.style.width = '8px';
			dot.style.height = '8px';
			dot.style.backgroundColor = 'white';
			dot.style.borderRadius = '50%';
			dot.style.animation = 'bounce 1.2s infinite ease-in-out';
			dot.style.animationDelay = `${i * 0.2}s`;
			typingIndicator.appendChild(dot);
		}
		
		return typingIndicator;
	}
	
	// Keyframe animation for dots
	const style = document.createElement('style');
	style.textContent = `
  	@keyframes bounce {
		0%, 80%, 100% {
			transform: translateY(0); /* Dots at original position */
		}
		40% {
			transform: translateY(-10px); /* Dots move up */
		}
    }
    `;
	document.head.appendChild(style);
	
	// Function to show the typing indicator (add it to the DOM if not already added)
	let isTypingVisible = false; // Flag to track typing indicator visibility
	
	// Listen for 'userTyping' event from the server
	socket.on('userTyping', ({ isTyping, sender }) => {
		if (sender === receiver) {
			if (isTyping) {
				console.log("typing show");
				if (!isTypingVisible) {
					// Show typing indicator and scroll only once
					showTypingIndicator();
					isTypingVisible = true;
					
					// Scroll down after ensuring the typing indicator is added
					setTimeout(() => {
						chat.scrollTo({
							top: chat.scrollHeight,
							behavior: "smooth"
						});					
					}, 0);
				}
			} else {
				console.log("typing hide");
				if (isTypingVisible) {
					// Hide typing indicator and update flag
					hideTypingIndicator();
					isTypingVisible = false;
				}
			}
		}
	});
	
	function showTypingIndicator() {
		// If the typing bubble doesn't exist, create it
		if (!typingBubble) {
			typingBubble = document.createElement('div');
			typingBubble.classList.add('bubble', 'right');
			typingBubble.id = 'dots';
			typingBubble.classList.add('typing'); // Add 'typing' class for identification
			typingIndicator = createTypingIndicator();
			typingBubble.appendChild(typingIndicator);
		}
		
		// Ensure the typing bubble is visible
		typingBubble.style.display = 'flex';
		typingIndicator.style.display = 'flex';
		
		// Only append the typing bubble if it hasn't been added yet
		if (!chat.contains(typingBubble)) {
			chat.appendChild(typingBubble); // Append the typing indicator to the correct place
		}
	}
	
	// Function to hide the typing indicator (remove from DOM temporarily)
	function hideTypingIndicator() {
		const typingBubble = document.getElementById('dots');
		if (typingBubble) {
			// Hide the typing bubble or remove it from the DOM
			typingBubble.style.display = 'none'; // Hide the bubble
			//typingBubble.remove(); // Alternatively, completely remove it
		}
	}
	
	// Function to append a new text message bubble
	function appendTextBubble(message) {
		// Before appending the new text bubble, hide any existing typing indicator
		hideTypingIndicator();
		
		const textBubble = document.createElement('div');
		textBubble.classList.add('bubble', 'right');
		textBubble.textContent = message;
		
		// Append the new text bubble to the chat container
		chat.appendChild(textBubble);
	}
	
	function adjustMarginForScrollbar() {
		//const chat = document.getElementById('chat');
		const messages = document.querySelectorAll('.left');
		
		// Check if the scrollbar is visible
		const hasScrollbar = chat.scrollHeight > chat.clientHeight;
		
		// Adjust right margin of messages based on scrollbar presence
		messages.forEach(message => {
			if (hasScrollbar) {
				console.log("marg")
				message.style.marginRight = '10px'; // Adjust margin when scrollbar is present
			} 
		});
	}
	
	socket.on('messagesResponse', (decryptedMessages) => {
		console.log(decryptedMessages);
		
		if (decryptedMessages.unreadCount > 0) {
			// Select all divs with the class "yourClassName"
			document.querySelectorAll('.unreadMessages').forEach(div => {
				// Check if the attribute "data-attribute" has the desired value
				if (div.getAttribute('data-username') == decryptedMessages.receiverUsername) {
					// Remove the div if it matches the attribute value
					let messageValue = parseInt(messCounter.getAttribute('value'), 10) || 0; // Default to 0 if NaN
					messageValue -= parseInt(div.getAttribute('value'), 10);
					//console.log(messageValue);
					messCounter.setAttribute('value', messageValue);
					messCounter.textContent = messageValue; 
					// div.remove();
				}
			});
		}
		receiverAvatar.innerHTML = ''; 
		receiverAvatar.textContent = ''; 
		receiverAvatar.textContent = ''; 
		receiverElement.textContent = receiver;
		// Clear existing content in #receiverAvatar
		// if (decryptedMessages.profileImage && )
		if (decryptedMessages.profileImage) {
			// Check for the presence of an img element
			const img = document.createElement('img');
			img.id = 'receiverImg';
			img.src = decryptedMessages.profileImage;
			receiverAvatar.appendChild(img);
			
		}
		else {
			const initials = document.createElement('div');
			console.log("initials", initials);
			initials.id = 'receiverInitials';
			console.log('check');

			initials.style.display = 'flex';
			initials.textContent = receiver.charAt(0).toUpperCase();
			receiverAvatar.appendChild(initials);
		}
		
		chat.innerHTML = '';
		decryptedMessages.messages.forEach(message => {
			if (message.senderUsername == username) {
				
				const sendDiv = document.createElement('div');
				sendDiv.classList.add('bubble', 'left');
				sendDiv.style.wordBreak = 'break-word';
				sendDiv.textContent = message.message;  // Add the message text
				const timeAndIcon = document.createElement('div');
				timeAndIcon.classList.add('timeAndIcon');
				timeAndIcon.style.display = 'flex';
				timeAndIcon.style.marginLeft = 'auto';
				// Create a paragraph element for the date
				const dateParagraph = document.createElement('p');
				dateParagraph.textContent = `${formatDateComparison(message.time)}`;
				dateParagraph.style.marginBottom = '0';
				dateParagraph.style.textAlign = 'right';
				if(message.toDelete == 1) {
					const cryptoIcon = document.createElement('i');
					cryptoIcon.classList.add('icon-user-secret');
					cryptoIcon.style.marginRight = '3px';
					cryptoIcon.style.marginTop = 'auto';
					timeAndIcon.appendChild(cryptoIcon);    
				}
				timeAndIcon.appendChild(dateParagraph);
				sendDiv.appendChild(timeAndIcon);
				// Append the date paragraph to the message div
				chat.appendChild(sendDiv);
				
				
				
				
				adjustMarginForScrollbar();
				jQuery("#messageContainer").scrollTop(jQuery("#messageContainer")[0].scrollHeight);
			}
			else {
				adjustMarginForScrollbar();
				const timeAndIcon = document.createElement('div');
				timeAndIcon.classList.add('timeAndIcon');
				timeAndIcon.style.display = 'flex';
				timeAndIcon.style.marginRight = 'auto';
				// Create a div element for the message bubble
				const recDiv = document.createElement('div');
				recDiv.classList.add('bubble', 'right');
				recDiv.style.wordBreak = 'break-word';
				recDiv.textContent = message.message;  // Add the message text
				
				// Create a paragraph element for the date
				const dateParagraph = document.createElement('p');
				dateParagraph.textContent = formatDateComparison(message.time);  // Format and add the date
				dateParagraph.style.marginBottom = '0';
				// Append the date paragraph to the message div
				timeAndIcon.appendChild(dateParagraph);
				if(message.toDelete == 1) {
					const cryptoIcon = document.createElement('i');
					cryptoIcon.classList.add('icon-user-secret');
					
					cryptoIcon.style.marginTop = 'auto';
					cryptoIcon.style.marginLeft = '3px';
					timeAndIcon.appendChild(cryptoIcon);    
				}
				
				
				recDiv.appendChild(timeAndIcon);
				//recDiv.appendChild(dateParagraph);
				
				// Append the message div to the chat container
				chat.appendChild(recDiv);
				jQuery("#messageContainer").scrollTop(jQuery("#messageContainer")[0].scrollHeight);
			}
			document.getElementById("messagesContent").addEventListener("transitionend", function(event) {
				const parent = event.target;
				const child = parent.querySelector(`[data-username="${decryptedMessages.receiverUsername}"]`);
				if (child) {
					console.log("remove");
					child.remove();
					document.querySelectorAll('.dropdown-content').forEach(element => {
						element.classList.remove('hide');
					});
				}
			}, { once: true }); 
			
		});
		if (decryptedMessages.type == 'button') document.querySelector(`.unreadMessages[data-username="${decryptedMessages.receiverUsername}"]`)?.remove();
		
		
	})
	
	function closeModal() {
		console.log("click");
		const modal = document.querySelector('.modal');
		modal.classList.remove('show'); // Trigger shrink
		menuGroups.classList.add('dropdown-content');
		menuGroups.classList.add('dropdown');
		menuInvitation.classList.add('dropdown-content');
		menuInvitation.classList.add('dropdown');
		menuMessages.classList.add('dropdown-content');
		menuMessages.classList.add('dropdown');
		
	}
	
	function customConfirm(inviting, cntr, groupName, groupInvitingName) {
		return new Promise((resolve) => {
			
			if (cntr == 'invCounter') document.getElementById('confirmText').textContent = `${inviting} has sent you a friend request. Do you accept?`;
			else document.getElementById('confirmText').textContent = `${groupInvitingName} has invited you to join the group ${groupName}. Do you accept?`;
			
			// Show the modal
			const modal = document.getElementById('confirmModal');
			modal.style.visibility = 'visible'; // Make it visible immediately
			
			// Trigger the animation
			setTimeout(() => {
				modal.classList.add('show');
			}, 10); // Slight delay to ensure the transition is applied
			
			document.getElementById('yesBtn').onclick = function() {
				resolve('yes');
				updateInvitationCounter(cntr);
				closeModal();
			};
			
			document.getElementById('noBtn').onclick = function() {
				resolve('no');
				updateInvitationCounter(cntr);
				closeModal();
			};
			
			document.getElementById('cancelBtn').onclick = function() {
				resolve('cancel');
				closeModal();
			};
			
			// Function to update the invitation counter
			function updateInvitationCounter(cntr) {
				let invitationValue = parseInt(document.getElementById(cntr).getAttribute('value'), 10) || 0;
				invitationValue--;
				document.getElementById(cntr).setAttribute('value', invitationValue);
				document.getElementById(cntr).textContent = invitationValue;
			}
		});
	}
	
	document.querySelectorAll('.dropdown-content').forEach(element => {
		element.addEventListener('click', function() {
			document.querySelectorAll('.dropdown-content').forEach(dropdown => {
				console.log('hide')
				dropdown.classList.add('hide'); 
			});
		});
	});
	
	const dropdowns = document.querySelectorAll(".dropdown-container");
	
	document.addEventListener("touchstart", function (event) {
		let clickedDropdown = null;
		
		dropdowns.forEach(dropdown => {
			if (dropdown.contains(event.target)) {
				clickedDropdown = dropdown;
			}
		});
		
		dropdowns.forEach(dropdown => {
			let content = dropdown.querySelector(".dropdown-content");
			
			if (dropdown === clickedDropdown) {
				// Toggle active only for the clicked dropdown
				if (!content.classList.contains("active")) {
					content.classList.add("active");
				} else {
					content.classList.remove("active");
				}
			} else {
				// Remove active from all other dropdowns
				content.classList.remove("active");
			}
		});
	});
	
	// Enable scrolling inside dropdown
	document.querySelectorAll(".dropdown-content").forEach((dropdown) => {
		dropdown.addEventListener("touchstart", (e) => {
			e.stopPropagation(); // Prevent dropdown from closing when touched
		});
		
		dropdown.addEventListener("touchmove", (e) => {
			e.stopPropagation(); // Allow scrolling
		});
	});
	
	document.querySelectorAll('button').forEach(button => {
		if (!button.querySelector('i')) { 
			button.addEventListener('click', function() {
				document.querySelectorAll('.dropdown-content').forEach(element => {
					element.classList.remove('hide');
				});
			});
		}
	});
	
});