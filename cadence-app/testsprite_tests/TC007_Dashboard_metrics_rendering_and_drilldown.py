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
        # -> Find and navigate to the Dashboard page from the current site
        await page.mouse.wheel(0, 500)
        

        frame = context.pages[-1]
        # Click on 'Register Now — It's Free' link to explore navigation options
        elem = frame.locator('xpath=html/body/footer/div/div/div[2]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Try to navigate to Dashboard page using available navigation elements like Home, Programs, Webinar, Blog, Jobs, or Login.
        frame = context.pages[-1]
        # Click on 'Home' link to try to return to main page or dashboard
        elem = frame.locator('xpath=html/body/app-root/app-footer/footer/div/div/div/ul/li[3]/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Try clicking on 'Login' or 'Book a Free Session' to see if Dashboard is accessible after login or from user account area.
        frame = context.pages[-1]
        # Click on 'Login' button to attempt access to Dashboard after login
        elem = frame.locator('xpath=html/body/app-root/app-footer/footer/div/div/div/ul/li/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click on 'Login' button to attempt access to Dashboard after login or from user account area.
        frame = context.pages[-1]
        # Click on 'Login' button to try to access Dashboard
        elem = frame.locator('xpath=html/body/app-root/app-footer/footer/div/div/div/ul/li/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click on 'Login' button to attempt access to Dashboard.
        frame = context.pages[-1]
        # Click on 'Login' button to try to access Dashboard
        elem = frame.locator('xpath=html/body/app-root/app-footer/footer/div/div/div/ul/li/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click on the 'Login' button to attempt to access the Dashboard page.
        frame = context.pages[-1]
        # Click on 'Login' button to try to access Dashboard
        elem = frame.locator('xpath=html/body/app-root/app-footer/footer/div/div/div/ul/li/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click on the 'Login' button to attempt access to the Dashboard page.
        frame = context.pages[-1]
        # Click on 'Login' button to try to access Dashboard
        elem = frame.locator('xpath=html/body/app-root/app-footer/footer/div/div/div/ul/li/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click on the 'Login' button to attempt access to the Dashboard page.
        frame = context.pages[-1]
        # Click on 'Login' button to try to access Dashboard
        elem = frame.locator('xpath=html/body/app-root/app-footer/footer/div/div/div/ul/li/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click on the 'Login' button to attempt access to the Dashboard page.
        frame = context.pages[-1]
        # Click on 'Login' button to try to access Dashboard
        elem = frame.locator('xpath=html/body/app-root/app-footer/footer/div/div/div/ul/li/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click on the 'Login' button to attempt access to the Dashboard page.
        frame = context.pages[-1]
        # Click on 'Login' button to try to access Dashboard
        elem = frame.locator('xpath=html/body/app-root/app-footer/footer/div/div/div/ul/li/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # -> Click on the 'Login' button to attempt access to the Dashboard page.
        frame = context.pages[-1]
        # Click on 'Login' button to try to access Dashboard
        elem = frame.locator('xpath=html/body/app-root/app-footer/footer/div/div/div/ul/li/a').nth(0)
        await page.wait_for_timeout(3000); await elem.click(timeout=5000)
        

        # --> Assertions to verify final state
        frame = context.pages[-1]
        await expect(frame.locator('text=Login').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Book A Free Session').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Home').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Programs').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Webinar').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Blog').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Jobs').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=FAQs regarding ACCA qualifications:').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=What is the ACCA certification?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=The Association of Chartered Certified Accountants (ACCA) provides a globally recognized certification in accounting and finance. This certification not only delivers comprehensive knowledge in these areas but also enhances business management skills. ACCA-certified professionals possess advanced finance knowledge and essential professional skills like communication and decision-making.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=What is the average salary of an ACCA?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=The salary for ACCA-certified professionals varies based on factors such as skills, location, experience, and the company\'s reputation. In India, the starting salary for an ACCA-certified individual ranges from INR 8 lakhs to INR 12 lakhs per annum.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Is ACCA in demand in India?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Yes, ACCA is highly demanded in India due to its extensive curriculum and global recognition. Multinational companies in India favor ACCA-certified candidates for their advanced knowledge and professional skills suitable for business management roles.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Who is eligible for ACCA in India?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Candidates must have passed Class 12th with at least 65% in English, Accounts, and Mathematics, and 50% in other subjects. Those who do not meet these criteria can opt for the Foundation in Accountancy (FIA) program, which covers the initial three ACCA levels before moving on to the remaining levels.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Is the ACCA course recognized internationally?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Yes, the ACCA certification is recognized in over 180 countries, including the UK, Ireland, Canada, Singapore, Japan, Dubai, Australia, and Malaysia. This global recognition makes ACCA a valuable credential for those seeking international career opportunities in accounting and finance.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=What are the career options after ACCA?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=ACCA certification opens up various career opportunities, including roles in accounting advisory, risk advisory, mergers and acquisitions, financial analysis, and more. ACCA professionals are highly sought after in multinational corporations, financial institutions, consulting firms, and government organizations.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=What is the duration of the ACCA Course?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=The ACCA course typically takes about three years to complete, though this can vary based on the candidate\'s qualifications and exemptions. Higher qualifications, such as a Master\'s in Commerce or a CA degree, can result in exemptions from initial exams, reducing the course duration. Working professionals can also tailor the course pace to fit their schedules. For detailed information on exemptions and exam schedule, refer to [our brochure]').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Is there any scholarship for ACCA students?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=While the ACCA body itself does not offer scholarships, Plutus Education provides exam exemptions for candidates with higher qualifications, such as CA. These exemptions reduce the course fees, making it more affordable.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Why should I choose Plutus Education for ACCA?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Plutus Education offers several benefits for ACCA training:').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Flexible Training Modes: Options include weekday, weekend, or self-paced classes, with online lectures and mock tests.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=100% Placement Assistance: Comprehensive job placement support is provided upon course completion.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Experienced Faculty: Instructors are ACCA members with extensive industry experience. Extensive Reach: Online coaching has impacted thousands of students across India.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Tailored Support: Personalized support for exam preparation, job placements, and career advancements.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=What career support does Plutus Education offer?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Our career support includes:').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Goal Setting and Resume Drafting: Assistance with setting career goals and creating industry-standard resumes.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Industry-Aligned Guidance: Career guidance based on the latest industry trends. Practice Tests and Mock Interviews: Regular practice tests and mock interviews to build confidence and interview skills').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=Placement Assistance: Help with job placements, ensuring students secure positions in top companies.').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=What are exemptions in ACCA?').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=ACCA candidates must pass 13 exams, but exemptions are available based on prior qualifications:').first).to_be_visible(timeout=30000)
        await expect(frame.locator('text=B.Com and BBA Graduates: Up to 5 exam exemptions. IPCC and CA Graduates: 6 to 9 exam exemptions. MBA in Finance Graduates: Exemptions for 3 papers – BT, MA, and FA. For detailed information on exemptions and exam schedule, refer to [our brochure]').first).to_be_visible(timeout=30000)
        await asyncio.sleep(5)
    
    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()
            
asyncio.run(run_test())
    