// Dark mode toggle functionality
function initTheme() {
    const toggleSwitch = document.querySelector('#checkbox');
    const currentTheme = localStorage.getItem('theme') || 'light'; // Set default theme to light

    // Set initial theme
    document.documentElement.setAttribute('data-theme', currentTheme);
    toggleSwitch.checked = currentTheme === 'dark';

    function switchTheme(e) {
        const theme = e.target.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    toggleSwitch.addEventListener('change', switchTheme);
}

// Initialize EmailJS
(function() {
    // Initialize EmailJS with your public key
    emailjs.init("2oezVB5Cqb6WDk-Ex");
})();

// Handle form submission
document.getElementById('contactForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form elements
    const form = this;
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.textContent;
    
    // Show loading state
    submitBtn.disabled = true;
    submitBtn.textContent = 'Sending...';
    
    // Get form data
    const formData = {
        from_name: form.from_name.value,
        from_email: form.from_email.value,
        message: form.message.value
    };
    
    // Send email using EmailJS
    emailjs.send('service_id', 'template_id', formData)
        .then(function(response) {
            // Show success message
            showFormMessage('Message sent successfully!', 'success');
            form.reset();
        }, function(error) {
            // Show error message
            showFormMessage('Failed to send message. Please try again.', 'error');
        })
        .finally(function() {
            // Reset button state
            submitBtn.disabled = false;
            submitBtn.textContent = originalBtnText;
        });
});

// Function to show form messages
function showFormMessage(message, type) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.textContent = message;
    
    const form = document.getElementById('contactForm');
    form.appendChild(messageDiv);
    
    // Remove message after 5 seconds
    setTimeout(() => {
        messageDiv.remove();
    }, 5000);
}

// Notification function
function showNotification(message, type) {
    // Don't show notification if there's no real error message
    if (type === 'error' && (!message || message === 'Error loading comments')) {
        console.log('Suppressing generic error notification');
        return;
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    // Add notification to page
    document.body.appendChild(notification);

    // Show notification with animation
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);

    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Scroll Animation Handler
document.addEventListener('DOMContentLoaded', () => {
    // Initialize theme
    initTheme();

    // Hamburger Menu
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('nav ul');
    
    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('show');
    });

    // Close menu when clicking a nav link
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('show');
        });
    });

    const header = document.querySelector('header');
    let lastScroll = 0;
    
    // Add animation classes to elements
    const sections = document.querySelectorAll('section');
    sections.forEach((section, index) => {
        section.style.setProperty('--section-index', index);
    });

    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach((card, index) => {
        card.style.setProperty('--card-index', index);
    });

    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach((category, index) => {
        category.style.setProperty('--card-index', index);
    });

    // Smooth scroll for navigation links with offset
    document.querySelectorAll('nav a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                // Get header height for offset
                const headerHeight = document.querySelector('header').offsetHeight;
                const targetPosition = targetSection.offsetTop - headerHeight;
                
                // Smooth scroll to target with offset
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
                
                // Update active state
                document.querySelectorAll('nav a').forEach(navLink => {
                    navLink.classList.remove('active');
                });
                link.classList.add('active');
            }
        });
    });

    // Active navigation link handling with offset
    const navLinks = document.querySelectorAll('nav a');
    const observerOptions = {
        root: null,
        rootMargin: '-80px 0px 0px 0px', // Adjusted for header height
        threshold: 0.1
    };

    const handleIntersect = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${id}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    };

    const observer = new IntersectionObserver(handleIntersect, observerOptions);

    // Observe sections for navigation
    sections.forEach(section => {
        observer.observe(section);
    });

    // Intersection Observer for scroll animations
    const animationObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const animationObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, animationObserverOptions);

    // Observe all animated elements
    document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, section, .project-card, .skill-category').forEach((element) => {
        animationObserver.observe(element);
    });

    // Header scroll effect - just change background opacity
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll <= 0) {
            header.classList.remove('scrolled');
        } else {
            header.classList.add('scrolled');
        }
        
        lastScroll = currentScroll;
    });

    // Parallax effect for hero section
    const hero = document.querySelector('.hero');
    const profilePhoto = document.querySelector('.profile-photo');
    
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * 0.5;
        
        if (hero && profilePhoto) {
            hero.style.transform = `translateY(${rate * 0.5}px)`;
            profilePhoto.style.transform = `translateZ(50px) translateY(${-rate * 0.2}px)`;
        }
    });

    // Intersection Observer for fade-in animations
    const fadeObserverOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                if (entry.target.classList.contains('skill-item')) {
                    entry.target.style.animationPlayState = 'running';
                }
            }
        });
    }, fadeObserverOptions);

    // Observe all elements that should fade in
    const fadeElements = document.querySelectorAll('.fade-in, .slide-in-left, .slide-in-right, .scale-in, .skill-item');
    fadeElements.forEach(element => {
        fadeObserver.observe(element);
    });

    // Load initial comments
    loadComments();
    
    // Add sort functionality
    document.getElementById('commentSort').addEventListener('change', (e) => {
        const order = e.target.value === 'newest' ? 'desc' : 'asc';
        loadComments(order);
    });

    // Initialize rich text editor
    const toolbar = document.querySelector('.editor-toolbar');
    const commentText = document.getElementById('commentText');

    if (toolbar && commentText) {
        toolbar.addEventListener('click', (e) => {
            const button = e.target.closest('.toolbar-btn');
            if (!button) return;

            e.preventDefault();
            const format = button.dataset.format;
            
            // Get selection
            const start = commentText.selectionStart;
            const end = commentText.selectionEnd;
            const selection = commentText.value.substring(start, end);
            
            let replacement = '';
            switch (format) {
                case 'bold':
                    replacement = `**${selection}**`;
                    break;
                case 'italic':
                    replacement = `*${selection}*`;
                    break;
                case 'underline':
                    replacement = `_${selection}_`;
                    break;
                case 'link':
                    const url = prompt('Enter URL:');
                    if (url) {
                        replacement = `[${selection}](${url})`;
                    }
                    break;
                case 'image':
                    const imageUrl = prompt('Enter image URL:');
                    if (imageUrl) {
                        replacement = `![${selection}](${imageUrl})`;
                    }
                    break;
                case 'code':
                    replacement = `\`${selection}\``;
                    break;
            }
            
            if (replacement) {
                const newValue = commentText.value.substring(0, start) + 
                               replacement + 
                               commentText.value.substring(end);
                commentText.value = newValue;
                
                // Restore focus and selection
                commentText.focus();
                commentText.setSelectionRange(
                    start + replacement.length,
                    start + replacement.length
                );
            }
        });
    }
});

// Technology Quotes
const techQuotes = [
    {
        text: "Technology is best when it brings people together.",
        author: "Matt Mullenweg"
    },
    {
        text: "Innovation distinguishes between a leader and a follower.",
        author: "Steve Jobs"
    },
    {
        text: "The advance of technology is based on making it fit in so that you don't really even notice it, so it's part of everyday life.",
        author: "Bill Gates"
    },
    {
        text: "Any sufficiently advanced technology is indistinguishable from magic.",
        author: "Arthur C. Clarke"
    },
    {
        text: "The human spirit must prevail over technology.",
        author: "Albert Einstein"
    },
    {
        text: "Technology is nothing. What's important is that you have a faith in people, that they're basically good and smart, and if you give them tools, they'll do wonderful things with them.",
        author: "Steve Jobs"
    },
    {
        text: "The Web as I envisaged it, we have not seen it yet. The future is still so much bigger than the past.",
        author: "Tim Berners-Lee"
    },
    {
        text: "It has become appallingly obvious that our technology has exceeded our humanity.",
        author: "Albert Einstein"
    },
    {
        text: "The best way to predict the future is to create it.",
        author: "Peter Drucker"
    },
    {
        text: "Technology is just a tool. In terms of getting the kids working together and motivating them, the teacher is the most important.",
        author: "Bill Gates"
    }
];

// Quote Generator Modal
document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('quote-modal');
    const quoteButton = document.getElementById('quote-button');
    const closeButton = document.querySelector('.close-modal');
    const quoteText = document.getElementById('quote-text');
    const quoteAuthor = document.getElementById('quote-author');
    let currentQuoteIndex = -1;

    function getRandomQuote() {
        let newIndex;
        do {
            newIndex = Math.floor(Math.random() * techQuotes.length);
        } while (newIndex === currentQuoteIndex && techQuotes.length > 1);
        
        currentQuoteIndex = newIndex;
        return techQuotes[currentQuoteIndex];
    }

    function animateQuote() {
        const quote = getRandomQuote();
        
        // Reset animations by removing show class
        quoteText.style.opacity = '0';
        quoteAuthor.style.opacity = '0';
        
        // Trigger reflow to restart animations
        void quoteText.offsetWidth;
        void quoteAuthor.offsetWidth;
        
        // Set new content
        setTimeout(() => {
            quoteText.textContent = quote.text;
            quoteAuthor.textContent = quote.author;
            
            // Fade in the new content
            quoteText.style.opacity = '1';
            quoteAuthor.style.opacity = '1';
        }, 300);
    }

    function showQuote() {
        const quote = getRandomQuote();
        quoteText.textContent = quote.text;
        quoteAuthor.textContent = quote.author;
        modal.classList.add('show');
        
        // Add animation class after a short delay
        setTimeout(() => {
            quoteText.style.opacity = '1';
            quoteAuthor.style.opacity = '1';
        }, 100);
    }

    function hideModal() {
        // First fade out the quote content
        quoteText.style.opacity = '0';
        quoteAuthor.style.opacity = '0';
        
        // Then remove the show class after a short delay
        setTimeout(() => {
            modal.classList.remove('show');
        }, 300);
    }

    // Event Listeners
    quoteButton.addEventListener('click', showQuote);
    closeButton.addEventListener('click', hideModal);
    
    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === modal) {
            hideModal();
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(event) {
        if (event.key === 'Escape' && modal.classList.contains('show')) {
            hideModal();
        }
    });

    // Add click handler for getting a new quote while modal is open
    quoteButton.addEventListener('click', function() {
        if (modal.classList.contains('show')) {
            animateQuote();
        }
    });
});

// Update Philippines time
function updatePhilippinesTime() {
    const options = {
        timeZone: 'Asia/Manila',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
    };
    
    const timeElement = document.getElementById('ph-time');
    if (timeElement) {
        const now = new Date();
        timeElement.textContent = now.toLocaleTimeString('en-US', options);
    }
}

// Update time every second
setInterval(updatePhilippinesTime, 1000);
updatePhilippinesTime(); // Initial call

// Comments functionality
let comments = [];
let likedComments = {};

// Load comments from Firestore
async function loadComments(order = 'desc') {
    try {
        console.log('Loading comments...');
        const commentsRef = db.collection('comments');
        const snapshot = await commentsRef.orderBy('timestamp', order).get();
        const commentsContainer = document.getElementById('commentsContainer');
        
        if (!commentsContainer) {
            console.error('Comments container not found');
            return;
        }
        
        commentsContainer.innerHTML = ''; // Clear existing comments
        
        if (snapshot.empty) {
            console.log('No comments found');
            commentsContainer.innerHTML = '<p class="no-comments">No comments yet. Be the first to comment!</p>';
            updateCommentCount();
            return;
        }

        console.log(`Found ${snapshot.size} comments`);
        
        for (const doc of snapshot.docs) {
            const comment = doc.data();
            const commentId = doc.id;
            console.log('Processing comment:', { id: commentId, data: comment });
            
            try {
                // Get replies for this comment
                console.log(`Fetching replies for comment: ${commentId}`);
                const repliesSnapshot = await db.collection('replies')
                    .where('parentCommentId', '==', commentId)
                    .orderBy('timestamp', 'asc')
                    .get();
                
                console.log(`Found ${repliesSnapshot.size} replies for comment ${commentId}`);
                
                const replies = repliesSnapshot.docs.map(replyDoc => {
                    const replyData = replyDoc.data();
                    console.log('Reply data:', { id: replyDoc.id, data: replyData });
                    return {
                        id: replyDoc.id,
                        ...replyData
                    };
                });
                
                console.log('Creating comment element with replies:', replies);
                const commentElement = createCommentElement(commentId, comment, replies);
                console.log('Comment element created:', commentElement);
                commentsContainer.appendChild(commentElement);
            } catch (replyError) {
                console.error('Error loading replies for comment:', commentId, replyError);
                const commentElement = createCommentElement(commentId, comment, []);
                commentsContainer.appendChild(commentElement);
            }
        }

        // Update comment count
        updateCommentCount();
    } catch (error) {
        console.error('Error loading comments:', error);
        const commentsContainer = document.getElementById('commentsContainer');
        if (commentsContainer) {
            commentsContainer.innerHTML = '<p class="error-message">Error loading comments. Please try again later.</p>';
        }
        if (error.code !== 'permission-denied') {
            showNotification('Error loading comments', 'error');
        }
    }
}

// Save comment to Firestore
async function saveComment(comment) {
    try {
        console.log('Saving comment with data:', comment); // Debug log
        const commentsRef = db.collection('comments');
        const newComment = {
            name: comment.name,
            email: comment.email, // Make sure email is included
            text: comment.text,
            likes: 0,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        console.log('New comment data:', newComment); // Debug log
        await commentsRef.add(newComment);
        showNotification('Comment posted successfully!', 'success');
        loadComments(); // Reload comments
    } catch (error) {
        console.error('Error saving comment:', error);
        showNotification('Error posting comment', 'error');
    }
}

// Update likes in Firestore
async function updateLikes(commentId, newLikeCount) {
    try {
        await db.collection('comments').doc(commentId).update({
            likes: newLikeCount
        });
    } catch (error) {
        console.error('Error updating likes:', error);
        showNotification('Error updating likes', 'error');
    }
}

// Create comment element
function createCommentElement(commentId, comment, replies) {
    console.log('Creating comment with email:', comment.email);
    const div = document.createElement('div');
    div.className = 'comment';
    div.innerHTML = `
        <div class="comment-header">
            <div class="commenter-info">
                <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(comment.name)}&background=random" class="commenter-avatar" alt="${comment.name}">
                <div class="commenter-details">
                    <span class="commenter-name">${comment.name}</span>
                    <span class="comment-timestamp">${comment.timestamp ? new Date(comment.timestamp.toDate()).toLocaleString() : 'Just now'}</span>
                    <span class="comment-email" style="display: none;">${comment.email}</span>
                </div>
            </div>
        </div>
        <div class="comment-body" id="comment-body-${commentId}">
            <p>${comment.text}</p>
        </div>
        <div class="comment-edit-form" id="comment-edit-${commentId}" style="display: none;">
            <textarea class="edit-comment-text">${comment.text}</textarea>
            <div class="edit-actions">
                <button type="button" class="cancel-edit" onclick="cancelEditComment('${commentId}')">Cancel</button>
                <button type="button" class="save-edit" onclick="saveEditComment('${commentId}', '${comment.email}')">Save</button>
            </div>
        </div>
        <div class="comment-actions">
            <button class="action-btn like-btn" onclick="likeComment('${commentId}')">
                <i class="fas fa-heart"></i>
                <span class="like-count">${comment.likes || 0}</span>
            </button>
            <button class="action-btn reply-btn" onclick="showReplyForm('${commentId}')">
                <i class="fas fa-reply"></i>
                Reply
            </button>
            <button class="action-btn edit-btn" onclick="showEditComment('${commentId}', '${comment.email}')">
                <i class="fas fa-edit"></i>
                Edit
            </button>
            <button class="action-btn delete-btn" onclick="deleteComment('${commentId}', '${comment.email}')">
                <i class="fas fa-trash"></i>
            </button>
        </div>
        <div class="reply-form-container" id="reply-form-${commentId}" style="display: none;">
            <form class="reply-form" onsubmit="event.preventDefault(); submitReply('${commentId}')">
                <div class="user-info">
                    <input type="text" class="reply-name" placeholder="Your Name" required>
                    <input type="email" class="reply-email" placeholder="Your Email" required>
                </div>
                <textarea class="reply-text" placeholder="Write a reply..." required></textarea>
                <div class="reply-form-actions">
                    <button type="button" class="cancel-reply" onclick="hideReplyForm('${commentId}')">Cancel</button>
                    <button type="submit" class="submit-reply">Reply</button>
                </div>
            </form>
        </div>
        <div class="replies" id="replies-${commentId}" style="display: block !important;">
            ${createRepliesHTML(replies, commentId)}
        </div>
    `;
    return div;
}

// Create HTML for replies
function createRepliesHTML(replies, parentCommentId) {
    if (!replies || replies.length === 0) {
        return '';
    }
    
    return replies.map(reply => {
        console.log('Creating reply with email:', reply.email);
        return `
            <div class="reply" id="reply-${reply.id}" style="display: block !important;">
                <div class="reply-header">
                    <div class="replier-info">
                        <img src="https://ui-avatars.com/api/?name=${encodeURIComponent(reply.name)}&background=random" class="replier-avatar" alt="${reply.name}">
                        <div class="replier-details">
                            <span class="replier-name">${reply.name}</span>
                            <span class="reply-timestamp">${reply.timestamp ? new Date(reply.timestamp.toDate()).toLocaleString() : 'Just now'}</span>
                            <span class="reply-email" style="display: none;">${reply.email}</span>
                        </div>
                    </div>
                </div>
                <div class="reply-body" id="reply-body-${reply.id}">
                    <p>${reply.text}</p>
                </div>
                <div class="reply-edit-form" id="reply-edit-${reply.id}" style="display: none;">
                    <textarea class="edit-reply-text">${reply.text}</textarea>
                    <div class="edit-actions">
                        <button type="button" class="cancel-edit" onclick="cancelEditReply('${reply.id}')">Cancel</button>
                        <button type="button" class="save-edit" onclick="saveEditReply('${parentCommentId}', '${reply.id}', '${reply.email}')">Save</button>
                    </div>
                </div>
                <div class="reply-actions">
                    <button class="action-btn edit-btn" onclick="showEditReply('${reply.id}', '${reply.email}')">
                        <i class="fas fa-edit"></i>
                        Edit
                    </button>
                    <button class="action-btn delete-btn" onclick="deleteReply('${parentCommentId}', '${reply.id}', '${reply.email}')">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

// Show reply form
function showReplyForm(commentId) {
    document.getElementById(`reply-form-${commentId}`).style.display = 'block';
}

// Hide reply form
function hideReplyForm(commentId) {
    document.getElementById(`reply-form-${commentId}`).style.display = 'none';
}

// Submit reply
async function submitReply(commentId) {
    try {
        console.log('Submitting reply for comment:', commentId);
        const form = document.querySelector(`#reply-form-${commentId} .reply-form`);
        const name = form.querySelector('.reply-name').value;
        const email = form.querySelector('.reply-email').value;
        const text = form.querySelector('.reply-text').value;

        console.log('Reply form data:', { name, email, text }); // Debug log

        const newReply = {
            parentCommentId: commentId,
            name: name,
            email: email, // Make sure email is included
            text: text,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        console.log('New reply data:', newReply); // Debug log
        const docRef = await db.collection('replies').add(newReply);
        console.log('Reply saved with ID:', docRef.id);
        
        // Clear the form
        form.reset();
        
        // Hide the reply form
        hideReplyForm(commentId);
        
        // Show success notification
        showNotification('Reply posted successfully!', 'success');
        
        // Add a small delay before reloading comments
        setTimeout(async () => {
            try {
                // Get the updated replies for this comment
                const repliesSnapshot = await db.collection('replies')
                    .where('parentCommentId', '==', commentId)
                    .orderBy('timestamp', 'asc')
                    .get();
                
                console.log('Fetched updated replies:', repliesSnapshot.docs.map(doc => doc.data()));
                
                const replies = repliesSnapshot.docs.map(replyDoc => ({
                    id: replyDoc.id,
                    ...replyDoc.data()
                }));
                
                // Update just the replies section for this comment
                const repliesContainer = document.getElementById(`replies-${commentId}`);
                console.log('Replies container:', repliesContainer);
                
                if (repliesContainer) {
                    const repliesHTML = createRepliesHTML(replies, commentId);
                    console.log('Setting replies HTML:', repliesHTML);
                    repliesContainer.innerHTML = repliesHTML;
                } else {
                    console.log('Replies container not found, reloading all comments');
                    loadComments();
                }
            } catch (error) {
                console.error('Error updating replies:', error);
                // Fallback to reloading all comments
                loadComments();
            }
        }, 500);
    } catch (error) {
        console.error('Error posting reply:', error);
        showNotification('Error posting reply', 'error');
    }
}

// Delete reply
async function deleteReply(commentId, replyId, replyEmail) {
    const userEmail = document.getElementById('commenterEmail').value;
    
    if (isAdminMode || userEmail.toLowerCase() === replyEmail.toLowerCase()) {
        try {
            await db.collection('replies').doc(replyId).delete();
            
            showNotification('Reply deleted successfully!', 'success');
            loadComments(); // Reload comments to update the view
        } catch (error) {
            console.error('Error deleting reply:', error);
            showNotification('Error deleting reply', 'error');
        }
    } else {
        showNotification('You can only delete your own replies', 'error');
    }
}

// Delete comment from Firestore
async function deleteComment(commentId, commentEmail) {
    const userEmail = document.getElementById('commenterEmail').value;
    
    // Check if user is admin or the comment owner
    if (isAdminMode || userEmail.toLowerCase() === commentEmail.toLowerCase()) {
        try {
            await db.collection('comments').doc(commentId).delete();
            showNotification('Comment deleted successfully!', 'success');
            loadComments(); // Reload comments
        } catch (error) {
            console.error('Error deleting comment:', error);
            showNotification('Error deleting comment', 'error');
        }
    } else {
        showNotification('You can only delete your own comments', 'error');
    }
}

// Handle comment form submission
document.getElementById('commentForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const comment = {
        name: document.getElementById('commenterName').value,
        email: document.getElementById('commenterEmail').value,
        text: document.getElementById('commentText').value
    };
    
    await saveComment(comment);
    this.reset();
});

// Like comment functionality
async function likeComment(commentId) {
    try {
        const commentRef = db.collection('comments').doc(commentId);
        const doc = await commentRef.get();
        
        if (doc.exists) {
            const currentLikes = doc.data().likes || 0;
            const newLikes = currentLikes + 1;
            await updateLikes(commentId, newLikes);
            
            // Update UI
            const likeCount = document.querySelector(`[onclick="likeComment('${commentId}')"] .like-count`);
            if (likeCount) {
                likeCount.textContent = newLikes;
            }
            
            showNotification('Comment liked!', 'success');
        }
    } catch (error) {
        console.error('Error liking comment:', error);
        showNotification('Error liking comment', 'error');
    }
}

// Admin mode state
let isAdminMode = false;

// Toggle admin mode with password
function toggleAdminMode() {
    const adminPassword = "admin123"; // You should change this to a secure password
    const password = prompt("Enter admin password:");
    
    if (password === adminPassword) {
        isAdminMode = !isAdminMode;
        showNotification(`Admin mode ${isAdminMode ? 'enabled' : 'disabled'}`, 'success');
        // Add visual indicator for admin mode
        document.body.classList.toggle('admin-mode');
        // Reload comments to update delete buttons visibility
        loadComments();
    } else {
        showNotification('Invalid admin password', 'error');
    }
}

// Add admin mode button to the footer
document.addEventListener('DOMContentLoaded', function() {
    const footerBottom = document.querySelector('.footer-bottom');
    if (footerBottom) {
        const adminButton = document.createElement('button');
        adminButton.className = 'admin-toggle-btn';
        adminButton.innerHTML = '<i class="fas fa-shield-alt"></i> Admin';
        adminButton.onclick = toggleAdminMode;
        
        // Create a container for the admin button
        const adminContainer = document.createElement('div');
        adminContainer.className = 'admin-container';
        adminContainer.appendChild(adminButton);
        
        // Insert the admin container before the social links
        const socialLinks = footerBottom.querySelector('.social-links');
        footerBottom.insertBefore(adminContainer, socialLinks);
    }
});

// Update comment count
function updateCommentCount() {
    const countElement = document.querySelector('.comment-count');
    if (countElement) {
        db.collection('comments').get().then(snapshot => {
            countElement.textContent = snapshot.size;
        });
    }
}

// Add grammar checking function
function checkGrammar(text) {
    // Basic grammar fixes
    let correctedText = text;
    
    // Capitalize first letter of sentences
    correctedText = correctedText.replace(/([.!?]\s+)([a-z])/g, (match, p1, p2) => p1 + p2.toUpperCase());
    correctedText = correctedText.charAt(0).toUpperCase() + correctedText.slice(1);
    
    // Add period if missing at the end
    if (!/[.!?]$/.test(correctedText)) {
        correctedText += '.';
    }
    
    // Fix common grammar mistakes
    const grammarFixes = {
        'i ': 'I ',
        'dont': "don't",
        'cant': "can't",
        'wont': "won't",
        'im': "I'm",
        'ive': "I've",
        'id': "I'd",
        'ill': "I'll",
        'its ': "it's ",
        'thats': "that's",
        'theyre': "they're",
        'theyll': "they'll",
        'youre': "you're",
        'youll': "you'll",
        'youve': "you've",
        'wasnt': "wasn't",
        'didnt': "didn't",
        'isnt': "isn't",
        'arent': "aren't",
        'wouldnt': "wouldn't",
        'shouldnt': "shouldn't",
        'couldnt': "couldn't",
        'whos': "who's",
        'whats': "what's",
        'wheres': "where's",
        'theres': "there's",
        'alot': "a lot"
    };

    for (let [incorrect, correct] of Object.entries(grammarFixes)) {
        correctedText = correctedText.replace(new RegExp('\\b' + incorrect + '\\b', 'gi'), correct);
    }
    
    return correctedText;
}

// Modify showEditComment to use prompt
function showEditComment(commentId, commentEmail) {
    if (!isAdminMode) {
        const userEmail = prompt('Please enter your email address to edit this comment:');
        if (!userEmail) {
            showNotification('An email address is required to edit comments', 'error');
            return;
        }
        
        console.log('Edit Comment Check:', {
            userEmail: userEmail,
            commentEmail: commentEmail,
            isAdmin: isAdminMode
        });
        
        if (userEmail.toLowerCase() !== commentEmail.toLowerCase()) {
            showNotification('You can only edit comments that you have created', 'error');
            return;
        }
    }
    
    const editForm = document.getElementById(`comment-edit-${commentId}`);
    const commentBody = document.getElementById(`comment-body-${commentId}`);
    
    if (!editForm || !commentBody) {
        console.error('Edit form or comment body not found:', { editForm, commentBody });
        return;
    }
    
    commentBody.style.display = 'none';
    editForm.style.display = 'block';
}

// Modify showEditReply to use prompt
function showEditReply(replyId, replyEmail) {
    if (!isAdminMode) {
        const userEmail = prompt('Please enter your email address to edit this reply:');
        if (!userEmail) {
            showNotification('An email address is required to edit replies', 'error');
            return;
        }
        
        console.log('Edit Reply Check:', {
            userEmail: userEmail,
            replyEmail: replyEmail,
            isAdmin: isAdminMode
        });
        
        if (userEmail.toLowerCase() !== replyEmail.toLowerCase()) {
            showNotification('You can only edit replies that you have created', 'error');
            return;
        }
    }
    
    const editForm = document.getElementById(`reply-edit-${replyId}`);
    const replyBody = document.getElementById(`reply-body-${replyId}`);
    
    if (!editForm || !replyBody) {
        console.error('Edit form or reply body not found:', { editForm, replyBody });
        return;
    }
    
    replyBody.style.display = 'none';
    editForm.style.display = 'block';
}

// Modify saveEditComment to include grammar check
async function saveEditComment(commentId, commentEmail) {
    try {
        const newText = document.querySelector(`#comment-edit-${commentId} .edit-comment-text`).value;
        const correctedText = checkGrammar(newText);
        
        await db.collection('comments').doc(commentId).update({
            text: correctedText,
            edited: true,
            editedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showNotification('Comment updated successfully!', 'success');
        loadComments();
    } catch (error) {
        console.error('Error updating comment:', error);
        showNotification('Error updating comment', 'error');
    }
}

// Modify saveEditReply to include grammar check
async function saveEditReply(parentCommentId, replyId, replyEmail) {
    try {
        const newText = document.querySelector(`#reply-edit-${replyId} .edit-reply-text`).value;
        const correctedText = checkGrammar(newText);
        
        await db.collection('replies').doc(replyId).update({
            text: correctedText,
            edited: true,
            editedAt: firebase.firestore.FieldValue.serverTimestamp()
        });
        
        showNotification('Reply updated successfully!', 'success');
        
        // Reload just the replies section for this comment
        const repliesSnapshot = await db.collection('replies')
            .where('parentCommentId', '==', parentCommentId)
            .orderBy('timestamp', 'asc')
            .get();
        
        const replies = repliesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        const repliesContainer = document.getElementById(`replies-${parentCommentId}`);
        if (repliesContainer) {
            repliesContainer.innerHTML = createRepliesHTML(replies, parentCommentId);
        }
    } catch (error) {
        console.error('Error updating reply:', error);
        showNotification('Error updating reply', 'error');
    }
}

// Also modify submitComment to include grammar check
async function submitComment(event) {
    event.preventDefault();
    
    const comment = {
        name: document.getElementById('commenterName').value,
        email: document.getElementById('commenterEmail').value,
        text: checkGrammar(document.getElementById('commentText').value)
    };
    
    await saveComment(comment);
    event.target.reset();
}

// Modify submitReply to include grammar check
async function submitReply(commentId) {
    try {
        const form = document.querySelector(`#reply-form-${commentId} .reply-form`);
        const name = form.querySelector('.reply-name').value;
        const email = form.querySelector('.reply-email').value;
        const text = checkGrammar(form.querySelector('.reply-text').value);

        const newReply = {
            parentCommentId: commentId,
            name: name,
            email: email,
            text: text,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        };
        
        const docRef = await db.collection('replies').add(newReply);
        
        form.reset();
        hideReplyForm(commentId);
        showNotification('Reply posted successfully!', 'success');
        
        // Reload the replies section
        const repliesSnapshot = await db.collection('replies')
            .where('parentCommentId', '==', commentId)
            .orderBy('timestamp', 'asc')
            .get();
        
        const replies = repliesSnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        
        const repliesContainer = document.getElementById(`replies-${commentId}`);
        if (repliesContainer) {
            repliesContainer.innerHTML = createRepliesHTML(replies, commentId);
        }
    } catch (error) {
        console.error('Error posting reply:', error);
        showNotification('Error posting reply', 'error');
    }
} 