// One-off: removes community-v2 test rows (MOOD posts, Stories, PostLikes,
// PostComments) so the *old* Render backend can deserialize the Post feed
// while the new code isn't deployed. Safe to re-run.
import { PrismaClient } from '@prisma/client';
const p = new PrismaClient();
(async () => {
  const likes = await p.postLike.deleteMany({});
  const comments = await p.postComment.deleteMany({});
  const views = await p.storyView.deleteMany({});
  const stories = await p.story.deleteMany({});
  const moods = await p.post.deleteMany({ where: { kind: 'MOOD' } });
  console.log('Deleted:', { likes: likes.count, comments: comments.count, views: views.count, stories: stories.count, moodPosts: moods.count });
  await p.$disconnect();
})();
