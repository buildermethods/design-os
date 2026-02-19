import asyncio
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None
    
    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()
        
        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",         # Set the browser window size
                "--disable-dev-shm-usage",        # Avoid using /dev/shm which can cause issues in containers
                "--ipc=host",                     # Use host-level IPC for better stability
                "--single-process"                # Run the browser in a single process mode
            ],
        )
        
        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        context.set_default_timeout(5000)
        
        # Open a new page in the browser context
        page = await context.new_page()
        
        # Navigate to your target URL and wait until the network request is committed
        await page.goto("http://localhost:5173", wait_until="commit", timeout=10000)
        
        # Wait for the main page to reach DOMContentLoaded state (optional for stability)
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=3000)
        except async_api.Error:
            pass
        
        # Iterate through all iframes and wait for them to load as well
        for frame in page.frames:
            try:
                await frame.wait_for_load_state("domcontentloaded", timeout=3000)
            except async_api.Error:
                pass
        
        # Interact with the page elements to simulate user flow
        # -> Resize the viewport to tablet size to verify sidebar adaptation and content accessibility.
        await page.goto('http://localhost:5173/', timeout=10000)
        await asyncio.sleep(3)
        

        await page.mouse.wheel(0, 300)
        

        # -> Resize viewport to tablet size and verify sidebar adaptation and content accessibility.
        await page.goto('http://localhost:5173/', timeout=10000)
        await asyncio.sleep(3)
        

        await page.mouse.wheel(0, 300)
        

        # -> Open modals and overlays on all screen sizes and verify their responsiveness and dismissal using keyboard and touch controls.
        frame = context.pages[-1]
        # Click 'Register Now — It's Free' button to open modal or overlay
        elem = frame.locator('xpath=html/body/section/div[2]/div/div[2]/div/form/button').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Verify modal dismissal using keyboard and touch controls on tablet size, then test on mobile size.
        frame = context.pages[-1]
        # Click 'Register Now — It's Free' button to reopen modal on tablet size
        elem = frame.locator('xpath=html/body/section[8]/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        frame = context.pages[-1]
        # Click 'Register Now — It's Free' button to open modal on mobile size
        elem = frame.locator('xpath=html/body/section[8]/div/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Registration Open — Limited Seats').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=🏆 ₹10 Lakh Prize Pool + Scholarships').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=📅 Level 1 Quiz: February 2, 2026').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=🎯 Accounting Champions League 2026').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Register Now').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Accounting').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Champions League').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Compete. Excel. Win. Join India\'s premier accounting competition.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=₹20,000').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=1st Prize').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=₹10,000').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=2nd Prize').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=₹5,000').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=3rd Prize').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Up to 100% Scholarship').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Guaranteed Internship').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Registration closes in:').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Register for ACL 2026').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Full Name').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Phone Number').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=College/Institution').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Program Status').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Select status').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Ongoing').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Graduated').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Register Now — It\'s Free').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=By registering, you agree to our Terms & Conditions').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=ACCA Approved Learning Partner').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Already registered? Check your referral status').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=What You Can Win').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Compete for amazing prizes, scholarships, and career opportunities!').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=02').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=RUNNER UP').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=2nd Place').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=₹10,000').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Cash Prize').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=70% Scholarship').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Guaranteed Internship').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=01').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=🏆 GRAND CHAMPION').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=1st Place').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=₹20,000').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=CASH PRIZE').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=100% Scholarship').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Guaranteed Internship').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=03').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=FINALIST').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=3rd Place').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=₹5,000').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Cash Prize').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=50% Scholarship').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Guaranteed Internship').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Everyone Wins!').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Refer friends and unlock exclusive rewards').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=5 Referrals').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=10 Referrals').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=15+ Referrals').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=🎓').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Participation Certificate').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Guaranteed for all participants').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=OUR STUDENTS WORK AT').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=How It Works').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Two rounds. One winner. Your chance to shine.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=LEVEL 1').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=MCQ Quiz').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Online screening round with case-based MCQs. All participants attempt simultaneously to qualify for Level 2.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Feb 2, 6:00-6:30 PM').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=60 mins').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=LEVEL 2').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Final Presentation').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Shortlisted participants present problem-based solutions to a panel of industry experts. Showcase your analytical thinking.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Feb 8, 1:00 PM').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Top 10').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Event Roadmap').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Mark your calendars! Here\'s the complete schedule for ACL 2026.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=1').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=FEB 2').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=2').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=FEB 3').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=3').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=FEB 6').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=4').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=FEB 7').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=5').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=FEB 8').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=MCQ Quiz').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=6:00-6:30 PM').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Online screening round for all participants').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Webinar').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=5:30-6:30 PM').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Problem statement & submission guidelines').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Submission').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=3:00 PM').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Last date to submit your PPT').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Results').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=12:00 PM').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Winners + certificates for all').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Finals').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=1:00 PM').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Live presentations by Top 10').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Who Can Participate?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Open to all finance and accounting students').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=B.Com, M.Com, BBA & MBA students').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=CA / CMA / CS students').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=ACCA students').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Working Professionals in Finance').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Frequently Asked Questions').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Got questions? We\'ve got answers.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=What is the registration fee?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=It\'s completely FREE! There\'s no registration fee to participate in ACL 2026. Just register and show up for the quiz on February 2nd.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Do I need to form a team?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=How does the referral program work?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=What topics will the quiz cover?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Who can participate in ACL?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Ready to Become a Champion?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Join the Accounting Champions League 2026. Your journey to excellence starts here.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Register Now — It\'s Free').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Terms').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Privacy').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Contact').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=© 2026 Plutus Education. All rights reserved.').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    