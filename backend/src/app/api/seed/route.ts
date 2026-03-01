import { NextRequest, NextResponse } from "next/server";
import { faker } from "@faker-js/faker";
import dbConnect from "../../../lib/db";
import User from "../../../models/User";
import Profile from "../../../models/Profile";
import { hashPassword } from "../../../lib/auth";

export async function GET() {
  try {
    await dbConnect();

    const createdUsers = [];
    const plainPassword = "password123";
    const hashedPassword = await hashPassword(plainPassword);

    // 1. Create Admin User (Fixed)
    const adminEmail = "admin@jaigurudev.com";
    let adminUser = await User.findOne({ email: adminEmail });
    
    if (!adminUser) {
      adminUser = await User.create({
        name: "Super Admin",
        email: adminEmail,
        phone: "+919876543210",
        password: hashedPassword,
        role: "admin",
        profileCompleted: true,
        isVerifiedByAdmin: true,
        agreedToTerms: true,
        status: "active",
        marriageStatus: "single", // Admins might not need this, but schema requires it or default
      });
      
      // Admin might not need a profile, but let's create a basic one to avoid null errors if UI expects it
      await Profile.create({
        userId: adminUser._id,
        gender: "Male",
        dob: new Date("1990-01-01"),
        height: "6'0\"",
        education: "Master of Administration",
        occupation: "System Administrator",
        location: "Mumbai, India",
        familyDetails: "Jaigurudev Family",
        spiritualDetails: "Admin",
        diet: "Vegetarian",
        about: "System Administrator and Moderator",
        profileImage: "https://ui-avatars.com/api/?name=Super+Admin&background=random",
        galleryImages: [],
        hiddenContactInfo: false,
      });
    }

    createdUsers.push({
      type: "ADMIN",
      name: adminUser.name,
      email: adminUser.email,
      password: plainPassword,
      id: adminUser._id,
      role: adminUser.role,
    });

    // 2. Create Fixed Demo User
    const demoUserEmail = "user@jaigurudev.com";
    let demoUser = await User.findOne({ email: demoUserEmail });

    if (!demoUser) {
      demoUser = await User.create({
        name: "Demo User",
        email: demoUserEmail,
        phone: "+919000000000",
        password: hashedPassword,
        role: "user",
        profileCompleted: true,
        isVerifiedByAdmin: true,
        agreedToTerms: true,
        status: "active",
        marriageStatus: "single",
      });

      await Profile.create({
        userId: demoUser._id,
        gender: "Female",
        dob: new Date("1995-05-15"),
        height: "5'6\"",
        education: "B.Tech",
        occupation: "Software Engineer",
        location: "Delhi, India",
        familyDetails: "Liberal Family",
        spiritualDetails: "Seeker",
        diet: "Vegetarian",
        about: "Looking for a spiritual partner.",
        profileImage: "https://ui-avatars.com/api/?name=Demo+User&background=random",
        galleryImages: [],
        hiddenContactInfo: true,
      });
    }

    createdUsers.push({
      type: "USER (FIXED)",
      name: demoUser.name,
      email: demoUser.email,
      password: plainPassword,
      id: demoUser._id,
      role: demoUser.role,
    });

    // 3. Create Dummy Users
    for (let i = 0; i < 19; i++) {
      const sex = faker.person.sexType(); // 'female' | 'male'
      const gender = sex.charAt(0).toUpperCase() + sex.slice(1); // 'Female' | 'Male'
      const firstName = faker.person.firstName(sex);
      const lastName = faker.person.lastName();
      const name = `${firstName} ${lastName}`;
      const email = faker.internet.email({ firstName, lastName }).toLowerCase();
      
      const phone = faker.phone.number();

      // Create User
      const user = await User.create({
        name,
        email,
        phone,
        password: hashedPassword,
        role: "user",
        profileCompleted: true,
        isVerifiedByAdmin: true,
        agreedToTerms: true,
        status: "active",
        marriageStatus: "single",
      });

      // Create Profile
      await Profile.create({
        userId: user._id,
        gender: gender,
        dob: faker.date.birthdate({ min: 21, max: 40, mode: "age" }),
        height: `${faker.number.int({ min: 4, max: 6 })}'${faker.number.int({ min: 0, max: 11 })}"`,
        education: faker.person.jobTitle(),
        occupation: faker.person.jobTitle(),
        location: `${faker.location.city()}, ${faker.location.state()}`,
        familyDetails: `Father: ${faker.person.fullName()}, Mother: ${faker.person.fullName()}`,
        spiritualDetails: "Follower of Jaigurudev",
        diet: faker.helpers.arrayElement(["Vegetarian", "Vegan", "Eggetarian"]),
        about: faker.lorem.paragraph(),
        profileImage: faker.image.avatar(),
        galleryImages: [
          faker.image.urlLoremFlickr({ category: "people" }),
          faker.image.urlLoremFlickr({ category: "nature" }),
        ],
        hiddenContactInfo: true,
      });

      createdUsers.push({
        type: "USER",
        name: user.name,
        email: user.email,
        password: plainPassword,
        id: user._id,
        role: user.role,
      });
    }

    return NextResponse.json(
      {
        message: "Successfully created Admin and 20 dummy users",
        count: createdUsers.length,
        users: createdUsers,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Seeding error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to seed database" },
      { status: 500 }
    );
  }
}
