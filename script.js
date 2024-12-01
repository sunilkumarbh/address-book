// Contact Management Class
class ContactManager {
    constructor() {
        this.contacts = JSON.parse(localStorage.getItem('contacts')) || [];
        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Form submission
        const contactForm = document.getElementById('contactForm');
        if (contactForm) {
            contactForm.addEventListener('submit', (e) => this.handleFormSubmit(e));
        }

        // Add contact button
        const addContactBtn = document.querySelector('.card-button[data-action="add"]');
        if (addContactBtn) {
            addContactBtn.addEventListener('click', () => this.showAddContactForm());
        }

        // View contacts button
        const viewContactsBtn = document.querySelector('.card-button[data-action="view"]');
        if (viewContactsBtn) {
            viewContactsBtn.addEventListener('click', () => this.showContacts());
        }

        // Cancel button
        const cancelBtn = document.getElementById('cancelBtn');
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.hideAddContactForm());
        }
    }

    showAddContactForm() {
        // Hide main cards
        document.querySelector('.cards-container').style.display = 'none';
        document.querySelector('.main-header').style.display = 'none';
        
        // Show form
        document.getElementById('add-contact-form').style.display = 'block';
    }

    hideAddContactForm() {
        // Show main cards
        document.querySelector('.cards-container').style.display = 'flex';
        document.querySelector('.main-header').style.display = 'block';
        
        // Hide form
        document.getElementById('add-contact-form').style.display = 'none';
        
        // Reset form
        document.getElementById('contactForm').reset();
    }

    handleFormSubmit(event) {
        event.preventDefault();

        // Get form values
        const newContact = {
            id: Date.now(),
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            createdAt: new Date().toISOString()
        };

        // Add to contacts array
        this.contacts.push(newContact);
        
        // Save to localStorage
        this.saveToLocalStorage();
        
        // Show success message
        this.showNotification('Contact added successfully!');
        
        // Reset and hide form
        this.hideAddContactForm();
    }

    saveToLocalStorage() {
        localStorage.setItem('contacts', JSON.stringify(this.contacts));
    }

    showContacts() {
        const mainContent = document.querySelector('.main-content');
        const contactsList = this.contacts.map(contact => `
            <div class="contact-card" data-id="${contact.id}">
                <div class="contact-info">
                    <h3>${contact.firstName} ${contact.lastName}</h3>
                    <p>${contact.email}</p>
                    <p>${contact.phone}</p>
                </div>
                <div class="contact-actions">
                    <button onclick="contactManager.editContact(${contact.id})" class="button secondary">
                        Edit
                    </button>
                    <button onclick="contactManager.deleteContact(${contact.id})" class="button danger">
                        Delete
                    </button>
                </div>
            </div>
        `).join('');

        mainContent.innerHTML = `
            <div class="contacts-view">
                <div class="contacts-header">
                    <h2>All Contacts</h2>
                    <button onclick="contactManager.showAddContactForm()" class="button primary">
                        Add New Contact
                    </button>
                </div>
                <div class="contacts-list">
                    ${contactsList.length ? contactsList : '<p class="no-contacts">No contacts found</p>'}
                </div>
                <button onclick="contactManager.showMainView()" class="button secondary">
                    Back to Home
                </button>
            </div>
        `;
    }

    editContact(id) {
        const contact = this.contacts.find(c => c.id === id);
        if (!contact) return;

        // Fill form with contact data
        document.getElementById('firstName').value = contact.firstName;
        document.getElementById('lastName').value = contact.lastName;
        document.getElementById('email').value = contact.email;
        document.getElementById('phone').value = contact.phone;
        document.getElementById('address').value = contact.address;

        // Show form
        this.showAddContactForm();
        
        // Update form submit handler for editing
        const form = document.getElementById('contactForm');
        form.onsubmit = (e) => {
            e.preventDefault();
            this.handleEditSubmit(id);
        };
    }

    handleEditSubmit(id) {
        const updatedContact = {
            id,
            firstName: document.getElementById('firstName').value,
            lastName: document.getElementById('lastName').value,
            email: document.getElementById('email').value,
            phone: document.getElementById('phone').value,
            address: document.getElementById('address').value,
            updatedAt: new Date().toISOString()
        };

        // Update contact in array
        this.contacts = this.contacts.map(contact => 
            contact.id === id ? updatedContact : contact
        );

        // Save to localStorage
        this.saveToLocalStorage();
        
        // Show success message
        this.showNotification('Contact updated successfully!');
        
        // Reset and hide form
        this.hideAddContactForm();
        
        // Show updated contacts list
        this.showContacts();
    }

    deleteContact(id) {
        if (confirm('Are you sure you want to delete this contact?')) {
            this.contacts = this.contacts.filter(contact => contact.id !== id);
            this.saveToLocalStorage();
            this.showNotification('Contact deleted successfully!');
            this.showContacts();
        }
    }

    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }
}

// Initialize the contact manager
const contactManager = new ContactManager(); 