document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registrationForm');
  const regTypes = document.getElementsByName('regType');
  const teamNameContainer = document.getElementById('teamNameContainer');
  const teamNameInput = document.getElementById('teamName');

  // Toggle Team Name field based on registration type
  regTypes.forEach(radio => {
    radio.addEventListener('change', (e) => {
      if (e.target.value === 'Team') {
        teamNameContainer.classList.remove('hidden');
        teamNameInput.setAttribute('required', 'true');
      } else {
        teamNameContainer.classList.add('hidden');
        teamNameInput.removeAttribute('required');
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (validateForm()) {
      showPaymentModal();
    }
  });

  const paymentModal = document.getElementById('paymentModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const payButton = document.getElementById('payButton');
  const successModal = document.getElementById('successModal');
  const refNumber = document.getElementById('refNumber');

  closeModalBtn.addEventListener('click', () => {
    hideModal(paymentModal);
  });

  payButton.addEventListener('click', () => {
    // Simulate payment processing
    const originalText = payButton.innerHTML;
    payButton.innerHTML = `<svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-black inline-block" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle><path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg> Processing...`;
    
    setTimeout(() => {
      hideModal(paymentModal);
      refNumber.textContent = 'CRIC-' + Math.floor(100000 + Math.random() * 900000);
      showModal(successModal);
      payButton.innerHTML = originalText;
    }, 1500);
  });

  function validateForm() {
    let isValid = true;
    
    // Helper to toggle error
    const toggleError = (id, condition) => {
      const el = document.getElementById(`err-${id}`);
      if (condition) {
        el.classList.add('hidden');
      } else {
        el.classList.remove('hidden');
        isValid = false;
      }
    };

    // Personal Details
    const fullName = document.getElementById('fullName').value.trim();
    toggleError('fullName', fullName.length > 0);

    const dob = document.getElementById('dob').value;
    toggleError('dob', dob !== '');

    const email = document.getElementById('email').value.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    toggleError('email', emailRegex.test(email));

    const phone = document.getElementById('phone').value.trim();
    toggleError('phone', phone.length >= 10);

    // Profile
    const role = document.getElementById('role').value;
    toggleError('role', role !== '');

    const battingStyle = document.querySelector('input[name="battingStyle"]:checked');
    toggleError('battingStyle', battingStyle !== null);

    const bowlingStyle = document.getElementById('bowlingStyle').value;
    toggleError('bowlingStyle', bowlingStyle !== '');

    // Team Status
    const regType = document.querySelector('input[name="regType"]:checked');
    toggleError('regType', regType !== null);

    if (regType && regType.value === 'Team') {
      const tName = teamNameInput.value.trim();
      toggleError('teamName', tName.length > 0);
    } else {
      toggleError('teamName', true); // hide error if not applicable
    }

    const eName = document.getElementById('emergencyName').value.trim();
    toggleError('emergencyName', eName.length > 0);

    const ePhone = document.getElementById('emergencyPhone').value.trim();
    toggleError('emergencyPhone', ePhone.length >= 10);

    // Uploads
    const profilePhoto = document.getElementById('profilePhoto').files.length;
    toggleError('profilePhoto', profilePhoto > 0);

    const govId = document.getElementById('govId').files.length;
    toggleError('govId', govId > 0);

    return isValid;
  }

  function showPaymentModal() {
    const name = document.getElementById('fullName').value;
    const type = document.querySelector('input[name="regType"]:checked').value;
    
    document.getElementById('summaryName').textContent = name;
    document.getElementById('summaryType').textContent = type === 'Team' ? 'Full Team Registration' : 'Individual Registration';
    document.getElementById('summaryFee').textContent = type === 'Team' ? '$500.00' : '$50.00';
    
    showModal(paymentModal);
  }

  function showModal(modal) {
    modal.classList.remove('hidden');
    // small delay for transition
    setTimeout(() => {
      modal.classList.remove('opacity-0');
      const content = modal.querySelector('div');
      if (content) {
        content.classList.remove('scale-95');
        content.classList.add('scale-100');
      }
    }, 10);
  }

  function hideModal(modal) {
    modal.classList.add('opacity-0');
    const content = modal.querySelector('div');
    if (content) {
      content.classList.remove('scale-100');
      content.classList.add('scale-95');
    }
    setTimeout(() => {
      modal.classList.add('hidden');
    }, 300);
  }
});
