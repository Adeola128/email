import { EmailTemplate } from './types';

export const PRESET_TEMPLATES: EmailTemplate[] = [
  {
    id: 'elite-invite',
    name: 'Elite Invite',
    subject: 'Exclusive Invitation: Oratora Grand Finale',
    category: 'Events',
    thumbnail: 'https://images.unsplash.com/photo-1578267139062-707029b36e11?auto=format&fit=crop&q=80&w=400',
    preheader: 'You are cordially invited to the design event of the year.',
    htmlContent: `
      <div style="background-color: #F8FAFC; padding: 40px 20px; font-family: 'Inter', sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; box-shadow: 0 10px 30px rgba(0,0,0,0.05);">
          <div style="background-color: #0A192F; padding: 60px 40px; text-align: center;">
            <h1 style="color: #64FFDA; font-size: 32px; margin: 0; text-transform: uppercase; letter-spacing: 4px;">Elite Invite</h1>
          </div>
          <div style="padding: 40px;">
            <h2 style="color: #0A192F; font-size: 24px; margin-bottom: 20px;">Hello {{name}},</h2>
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">We are thrilled to invite you to the <strong>Oratora Grand Finale</strong>. This exclusive event brings together the brightest minds in design and technology for a night of inspiration and networking.</p>
            <div style="margin: 30px 0; padding: 20px; background-color: #F1F5F9; border-radius: 16px;">
              <p style="margin: 5px 0; color: #0A192F;"><strong>Date:</strong> March 25th, 2026</p>
              <p style="margin: 5px 0; color: #0A192F;"><strong>Location:</strong> The Design Hub, London</p>
            </div>
            <div style="text-align: center; margin-top: 40px;">
              <a href="#" style="background-color: #64FFDA; color: #0A192F; padding: 16px 32px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block;">RSVP NOW</a>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'workshop-series',
    name: 'Workshop Series',
    subject: 'Masterclass: Visionary Voices Workshop',
    category: 'Education',
    thumbnail: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=400',
    preheader: 'Unlock your potential with our upcoming workshop series.',
    htmlContent: `
      <div style="background-color: #F8FAFC; padding: 40px 20px; font-family: 'Inter', sans-serif;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #FFFFFF; border-radius: 24px; overflow: hidden; border: 1px solid #E2E8F0;">
          <div style="padding: 40px; text-align: center;">
            <div style="display: inline-block; background-color: #64FFDA; color: #0A192F; padding: 8px 16px; border-radius: 100px; font-size: 12px; font-weight: bold; margin-bottom: 20px;">UPCOMING WORKSHOP</div>
            <h1 style="color: #0A192F; font-size: 36px; margin: 0; line-height: 1.1;">Visionary Voices</h1>
            <p style="color: #64748B; font-size: 18px; margin-top: 10px;">Master the art of presentation design.</p>
          </div>
          <img src="https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&q=80&w=600" style="width: 100%; height: auto; display: block;" />
          <div style="padding: 40px;">
            <p style="color: #475569; font-size: 16px; line-height: 1.6;">Hi {{name}}, are you ready to take your skills to the next level? Our multi-day workshop series is designed to give you practical insights and hands-on experience.</p>
            <ul style="color: #475569; font-size: 16px; line-height: 2; padding-left: 20px;">
              <li>Visual Storytelling Techniques</li>
              <li>Advanced Layout Principles</li>
              <li>Interactive Prototyping</li>
            </ul>
            <div style="text-align: center; margin-top: 40px;">
              <a href="#" style="background-color: #0A192F; color: #FFFFFF; padding: 16px 32px; border-radius: 100px; text-decoration: none; font-weight: bold; display: inline-block;">REGISTER FOR FREE</a>
            </div>
          </div>
        </div>
      </div>
    `
  },
  {
    id: 'community-blast',
    name: 'Community Blast',
    subject: 'Community Update: Celebrating Our Winners',
    category: 'Newsletter',
    thumbnail: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&q=80&w=400',
    preheader: 'See what our community has been up to this month.',
    htmlContent: `
      <div style="background-color: #FFFFFF; padding: 40px 20px; font-family: 'Inter', sans-serif;">
        <div style="max-width: 600px; margin: 0 auto;">
          <div style="border-bottom: 2px solid #F1F5F9; padding-bottom: 20px; margin-bottom: 40px;">
            <h1 style="color: #0A192F; font-size: 24px; margin: 0;">Oratora Community</h1>
          </div>
          <h2 style="color: #0A192F; font-size: 32px; margin-bottom: 20px;">Hello {{name}},</h2>
          <p style="color: #475569; font-size: 18px; line-height: 1.6; margin-bottom: 30px;">This month has been incredible! We've seen some truly visionary work from our members, and it's time to celebrate our recent competition winners.</p>
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px;">
            <div style="background-color: #F8FAFC; border-radius: 16px; padding: 20px;">
              <h3 style="color: #0A192F; margin-top: 0;">Recent Success</h3>
              <p style="color: #64748B; font-size: 14px;">Our members reached a milestone of 10,000 designs created this month!</p>
            </div>
            <div style="background-color: #F8FAFC; border-radius: 16px; padding: 20px;">
              <h3 style="color: #0A192F; margin-top: 0;">Upcoming Meetup</h3>
              <p style="color: #64748B; font-size: 14px;">Join us next Thursday for our virtual coffee chat and portfolio review.</p>
            </div>
          </div>

          <div style="text-align: center; padding: 40px; background-color: #0A192F; border-radius: 24px; color: #FFFFFF;">
            <h2 style="color: #64FFDA; margin-top: 0;">Join the Conversation</h2>
            <p style="margin-bottom: 30px;">Connect with over 5,000 designers on our Discord server.</p>
            <a href="#" style="background-color: #FFFFFF; color: #0A192F; padding: 12px 24px; border-radius: 12px; text-decoration: none; font-weight: bold; display: inline-block;">JOIN DISCORD</a>
          </div>
        </div>
      </div>
    `
  }
];
