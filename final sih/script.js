 document.addEventListener('DOMContentLoaded', function() {
            // Get all menu items
            const menuItems = document.querySelectorAll('.menu-item');
            
            // Add click event listeners to each menu item
            menuItems.forEach(item => {
                item.addEventListener('click', function() {
                    // Handle logout separately
                    if (this.getAttribute('data-target') === 'logout') {
                        if (confirm('Are you sure you want to logout?')) {
                            alert('Logout successful!');
                        }
                        return;
                    }
                    
                    // Get the target panel ID from data attribute
                    const targetPanel = this.getAttribute('data-target');
                    
                    // Remove active class from all menu items
                    menuItems.forEach(menuItem => {
                        menuItem.classList.remove('active');
                    });
                    
                    // Add active class to clicked menu item
                    this.classList.add('active');
                    
                    // Hide all panels
                    const allPanels = document.querySelectorAll('.panel-section');
                    allPanels.forEach(panel => {
                        panel.classList.remove('active');
                    });
                    
                    // Show the target panel
                    const targetElement = document.getElementById(targetPanel);
                    if (targetElement) {
                        targetElement.classList.add('active');
                    }
                    
                    // Special case for dashboard which has stats panel too
                    if (targetPanel === 'dashboard') {
                        document.getElementById('dashboard-stats').classList.add('active');
                    }
                });
            });
            
            // Initialize joystick functionality
            initJoystick();
            
            // Initialize pesticide panel functionality
            initPesticidePanel();
            
            // Initialize field map functionality
            initFieldMap();
            
            // Initialize theme selector
            initThemeSelector();
            
            // Initialize theme toggle button
            initThemeToggle();
        });
        
        // Simple joystick implementation
        function initJoystick() {
            const joystick = document.getElementById('joystick');
            const container = document.getElementById('joystickContainer');
            
            if (!joystick || !container) return;
            
            let isDragging = false;
            
            joystick.addEventListener('mousedown', startDrag);
            document.addEventListener('mousemove', drag);
            document.addEventListener('mouseup', stopDrag);
            
            joystick.addEventListener('touchstart', startDrag);
            document.addEventListener('touchmove', drag);
            document.addEventListener('touchend', stopDrag);
            
            function startDrag(e) {
                isDragging = true;
                e.preventDefault();
            }
            
            function drag(e) {
                if (!isDragging) return;
                
                const rect = container.getBoundingClientRect();
                const centerX = rect.left + rect.width / 2;
                const centerY = rect.top + rect.height / 2;
                
                let clientX, clientY;
                
                if (e.type === 'touchmove') {
                    clientX = e.touches[0].clientX;
                    clientY = e.touches[0].clientY;
                } else {
                    clientX = e.clientX;
                    clientY = e.clientY;
                }
                
                const deltaX = clientX - centerX;
                const deltaY = clientY - centerY;
                
                // Calculate distance from center
                const distance = Math.min(Math.sqrt(deltaX * deltaX + deltaY * deltaY), 80);
                
                // Calculate angle
                const angle = Math.atan2(deltaY, deltaX);
                
                // Calculate new position
                const newX = Math.cos(angle) * distance;
                const newY = Math.sin(angle) * distance;
                
                // Update joystick position
                joystick.style.transform = `translate(${newX}px, ${newY}px)`;
                
                // Update control values based on position
                updateControlValues(newX, newY, distance);
            }
            
            function stopDrag() {
                isDragging = false;
                // Reset joystick position
                joystick.style.transform = 'translate(0, 0)';
                
                // Reset control values
                document.getElementById('throttleValue').textContent = '0%';
                document.getElementById('yawValue').textContent = '0°';
                document.getElementById('pitchValue').textContent = '0°';
                document.getElementById('rollValue').textContent = '0°';
            }
            
            function updateControlValues(x, y, distance) {
                // Calculate values based on position (simplified)
                const throttle = Math.max(0, Math.min(100, Math.round(50 - (y / 80) * 50)));
                const yaw = Math.round((x / 80) * 45);
                const pitch = Math.round((y / 80) * 20);
                const roll = Math.round((x / 80) * 30);
                
                // Update display values
                document.getElementById('throttleValue').textContent = `${throttle}%`;
                document.getElementById('yawValue').textContent = `${yaw}°`;
                document.getElementById('pitchValue').textContent = `${pitch}°`;
                document.getElementById('rollValue').textContent = `${roll}°`;
            }
        }
        
        // Pesticide panel functionality
        function initPesticidePanel() {
            // Add event listeners for buttons in the pesticide panel
            const orderButtons = document.querySelectorAll('.order-btn');
            orderButtons.forEach(button => {
                button.addEventListener('click', function() {
                    if (this.textContent === 'Reorder') {
                        alert('Reorder request has been sent to supplier.');
                    } else {
                        alert('Monitoring chemical levels.');
                    }
                });
            });
            
            // Animate progress bars
            animateProgressBars();
        }
        
        function animateProgressBars() {
            const progressBars = document.querySelectorAll('.progress-fill');
            progressBars.forEach(bar => {
                const width = bar.style.width;
                bar.style.width = '0';
                setTimeout(() => {
                    bar.style.transition = 'width 1s ease-in-out';
                    bar.style.width = width;
                }, 100);
            });
        }
        
        // Field map functionality
        function initFieldMap() {
            const fieldCells = document.querySelectorAll('.field-cell');
            fieldCells.forEach(cell => {
                cell.addEventListener('click', function() {
                    fieldCells.forEach(c => c.classList.remove('active'));
                    this.classList.add('active');
                    
                    // Update the field selection buttons
                    document.querySelectorAll('.map-overlay button').forEach(btn => {
                        btn.classList.remove('btn-primary');
                        btn.classList.add('btn-outline');
                        btn.style.color = 'var(--primary)';
                        btn.style.borderColor = 'var(--primary)';
                    });
                    
                    // Find the button that matches this field
                    const fieldId = this.getAttribute('data-field');
                    const button = Array.from(document.querySelectorAll('.map-overlay button')).find(btn => 
                        btn.getAttribute('data-field') === fieldId
                    );
                    
                    if (button) {
                        button.classList.remove('btn-outline');
                        button.classList.add('btn-primary');
                        button.style.color = '';
                        button.style.borderColor = '';
                    }
                    
                    // Update field info
                    updateFieldInfo(fieldId);
                });
            });
            
            // Field selection button functionality
            document.querySelectorAll('.map-overlay button').forEach(button => {
                button.addEventListener('click', function() {
                    // Update button styles
                    document.querySelectorAll('.map-overlay button').forEach(btn => {
                        btn.classList.remove('btn-primary');
                        btn.classList.add('btn-outline');
                        btn.style.color = 'var(--primary)';
                        btn.style.borderColor = 'var(--primary)';
                    });
                    this.classList.remove('btn-outline');
                    this.classList.add('btn-primary');
                    this.style.color = '';
                    this.style.borderColor = '';
                    
                    // Update active field
                    const fieldId = this.getAttribute('data-field');
                    fieldCells.forEach(cell => {
                        cell.classList.remove('active');
                        if (cell.getAttribute('data-field') === fieldId) {
                            cell.classList.add('active');
                        }
                    });
                    
                    // Update field info
                    updateFieldInfo(fieldId);
                });
            });
        }
        
        function updateFieldInfo(fieldId) {
            // In a real application, you would fetch this data from an API
            const fieldData = {
                'A-1': { status: 'Normal', crop: 'Wheat', area: '10.2 acres', lastSprayed: '5 days ago' },
                'A-2': { status: 'Sprayed', crop: 'Corn', area: '12.5 acres', lastSprayed: '2 days ago' },
                'A-3': { status: 'Normal', crop: 'Soybean', area: '8.7 acres', lastSprayed: '6 days ago' },
                'A-4': { status: 'Normal', crop: 'Wheat', area: '9.3 acres', lastSprayed: '4 days ago' },
                'B-1': { status: 'Normal', crop: 'Corn', area: '11.8 acres', lastSprayed: '3 days ago' },
                'B-2': { status: 'Infected', crop: 'Corn', area: '12.5 acres', lastSprayed: '3 days ago' },
                'B-3': { status: 'Normal', crop: 'Soybean', area: '10.1 acres', lastSprayed: '2 days ago' },
                'B-4': { status: 'Normal', crop: 'Wheat', area: '9.7 acres', lastSprayed: '1 day ago' },
                'C-1': { status: 'Normal', crop: 'Corn', area: '13.2 acres', lastSprayed: '4 days ago' },
                'C-2': { status: 'Normal', crop: 'Soybean', area: '8.9 acres', lastSprayed: '5 days ago' },
                'C-3': { status: 'Normal', crop: 'Wheat', area: '10.5 acres', lastSprayed: '3 days ago' },
                'C-4': { status: 'Normal', crop: 'Corn', area: '11.3 acres', lastSprayed: '2 days ago' },
                'D-1': { status: 'Normal', crop: 'Soybean', area: '9.8 acres', lastSprayed: '6 days ago' },
                'D-2': { status: 'Normal', crop: 'Wheat', area: '10.7 acres', lastSprayed: '4 days ago' },
                'D-3': { status: 'Normal', crop: 'Corn', area: '12.1 acres', lastSprayed: '1 day ago' },
                'D-4': { status: 'Normal', crop: 'Soybean', area: '8.4 acres', lastSprayed: '3 days ago' }
            };
            
            const info = fieldData[fieldId];
            if (info) {
                const fieldInfo = document.querySelector('.field-info');
                fieldInfo.innerHTML = `
                    <h4>Field ${fieldId}</h4>
                    <p><strong>Status:</strong> <span style="color: ${info.status === 'Infected' ? 'var(--error)' : info.status === 'Sprayed' ? 'var(--success)' : 'var(--on-surface)'}">${info.status}</span></p>
                    <p><strong>Crop:</strong> ${info.crop}</p>
                    <p><strong>Area:</strong> ${info.area}</p>
                    <p><strong>Last Sprayed:</strong> ${info.lastSprayed}</p>
                `;
            }
        }
        
        // Theme selector functionality
        function initThemeSelector() {
            const themeOptions = document.querySelectorAll('.theme-option');
            themeOptions.forEach(option => {
                option.addEventListener('click', function() {
                    themeOptions.forEach(opt => opt.classList.remove('active'));
                    this.classList.add('active');
                    
                    const theme = this.getAttribute('data-theme');
                    setTheme(theme);
                });
            });
        }
        
        // Theme toggle functionality
        function initThemeToggle() {
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                themeToggle.addEventListener('click', function() {
                    const currentTheme = document.body.getAttribute('data-theme');
                    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
                    setTheme(newTheme);
                    
                    // Update theme toggle icon
                    const icon = this.querySelector('i');
                    icon.className = newTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
                });
            }
        }
        
        function setTheme(theme) {
            if (theme === 'auto') {
                // Auto theme based on system preference
                if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                    document.body.setAttribute('data-theme', 'dark');
                } else {
                    document.body.setAttribute('data-theme', 'light');
                }
            } else {
                document.body.setAttribute('data-theme', theme);
            }
            
            // Update theme options
            document.querySelectorAll('.theme-option').forEach(option => {
                option.classList.remove('active');
                if (option.getAttribute('data-theme') === theme) {
                    option.classList.add('active');
                }
            });
            
            // Save theme preference
            localStorage.setItem('theme', theme);
        }
        
        // Manual control functions
        function adjustAltitude(change) {
            alert(`Altitude adjustment: ${change > 0 ? '+' : ''}${change} meters`);
        }
        
        function returnToBase() {
            alert('Return to base command sent');
        }
        
        function hoverInPlace() {
            alert('Hover in place command sent');
        }
        
        function emergencyLanding() {
            alert('Emergency landing initiated');
        }
        
        // Load saved theme preference
        const savedTheme = localStorage.getItem('theme') || 'light';
        setTheme(savedTheme);
        
        // Update theme toggle icon based on current theme
        window.addEventListener('DOMContentLoaded', function() {
            const currentTheme = document.body.getAttribute('data-theme');
            const themeToggle = document.getElementById('themeToggle');
            if (themeToggle) {
                const icon = themeToggle.querySelector('i');
                icon.className = currentTheme === 'light' ? 'fas fa-moon' : 'fas fa-sun';
            }
        });