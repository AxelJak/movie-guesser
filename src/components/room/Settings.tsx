import { useZero, useQuery } from "@rocicorp/zero/react";
import { Schema } from "../../schema";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import { Slider } from "../ui/slider";
import { useForm } from "react-hook-form";
import MovielistSelect from "../setting/MovielistSelect";

interface SettingsFormValues {
  rounds: number;
  time: number;
  players: number;
  hints: number;
  emoji_explain_limit: number;
  listID: string;
}

interface SettingsProps {
  id?: string;
  rounds?: number;
  time?: number;
  players?: number;
  roomID?: string;
  hints?: number;
  emoji_explain_limit?: number;
  listID?: string;
}

export default function Settings({ roomSettings }: { roomSettings: SettingsProps }) {
  const z = useZero<Schema>();
  const players = z.query.player;
  const listQuery = z.query.list;

  const [roomPlayers] = useQuery(players.where("roomID", roomSettings.roomID ?? ''));
  const [lists] = useQuery(listQuery);

  console.log(roomSettings);
  
  const form = useForm<SettingsFormValues>({
    defaultValues: {
      rounds: roomSettings.rounds,
      time: roomSettings.time,
      players: roomSettings.players,
      hints: roomSettings.hints,
      emoji_explain_limit: roomSettings.emoji_explain_limit,
      listID: roomSettings.listID,
    },
  });

  const onSubmit = (values: SettingsFormValues) => {
    if (!roomSettings || !roomSettings.id) return;
    console.log(values);
    z.mutate.settings.update({
      id: roomSettings.id,
      ...values,
    });
  };

  if (!roomSettings) return null;

  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Room Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onChange={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="players"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Players</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>Current players: {roomPlayers.length}</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="listID"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Movielist</FormLabel>
                  <FormControl>
                    <MovielistSelect lists={lists} value={field.value} onSelect={(listId) => field.onChange(listId)} />
                  </FormControl>
                  <FormDescription>Description: {lists.find((list) => list.id === field.value)?.description}</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="time"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Time per Round (seconds)</FormLabel>
                  <FormControl>
                    <Slider
                      defaultValue={[90]}
                      min={30}
                      max={180}
                      step={30}
                      onChange={(e: any) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>Time to guess each movie: {field.value}s</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="rounds"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Rounds</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>How many rounds to play</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="hints"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Number of Hints</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>How many hints to give</FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="emoji_explain_limit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Max Explain emojis</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormDescription>How many emojis to explain with</FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
