export const runtime = 'edge';

import { NextResponse } from 'next/server';

// GitHub GraphQL API endpoint
const GITHUB_API = 'https://api.github.com/graphql';

export async function POST(request: Request) {
  try {
    const { username } = await request.json();
    
    if (!username) {
      return NextResponse.json(
        { error: 'GitHub username is required' },
        { status: 400 }
      );
    }

    // Get GitHub token from environment variable
    const token = process.env.GITHUB_TOKEN;
    
    if (!token) {
      return NextResponse.json(
        { 
          error: 'GitHub API token not configured. Please set the GITHUB_TOKEN environment variable.'
        },
        { status: 500 }
      );
    }
    
    console.log('GitHub API request for user:', username);
    console.log('Token available:', !!token);
    
    // GraphQL query to fetch contribution data
    const query = `
      query($username: String!) {
        user(login: $username) {
          contributionsCollection {
            contributionCalendar {
              totalContributions
              weeks {
                contributionDays {
                  contributionCount
                  date
                }
              }
            }
          }
        }
      }
    `;

    // Make the request to GitHub API
    const response = await fetch(GITHUB_API, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query, variables: { username } }),
    });

    const data = await response.json();
    
    // Check for errors in the GitHub API response
    if (data.errors) {
      console.error('GitHub API returned errors:', data.errors);
      return NextResponse.json(
        { error: data.errors[0].message },
        { status: 500 }
      );
    }

    // Extract the contribution data
    const contributionCalendar = data.data?.user?.contributionsCollection?.contributionCalendar;
    
    if (!contributionCalendar) {
      console.error('No contribution data found for user:', username);
      return NextResponse.json(
        { error: 'No contribution data found' },
        { status: 404 }
      );
    }

    // Return the contribution data
    return NextResponse.json({
      totalContributions: contributionCalendar.totalContributions,
      weeks: contributionCalendar.weeks
    });

  } catch (error) {
    console.error('Error fetching GitHub contributions:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Unknown error',
    }, { status: 500 });
  }
} 