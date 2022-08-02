<?php

namespace App\Controller;

use App\Entity\Agenda;
use App\Entity\Event;
use App\Entity\User;
use App\Form\EventType;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\BrowserKit\Request;

class AgendaController extends AbstractController
{
    #[Route(
        '{_locale}/agenda',
        name: 'app_agenda',
        requirements: ['_locale' => 'en|fr'],
        defaults: ['_locale' => 'en']
    )]
    public function index(): Response
    {
        $this->denyAccessUnlessGranted('ROLE_USER');

        /** @var User $user */
        $user = $this->getUser();
        if (!$user->getAgenda())
            $user->setAgenda(new Agenda);
        $agenda = $user->getAgenda();

        $event = new Event;
        $form = $this->createForm(EventType::class, $event);

        return $this->render('agenda/index.html.twig', [
            'title' => 'Your agenda',
            'events' => $agenda->getEvents(),
            'agenda' => $agenda,
            'eventForm' => $form->createView()
        ]);
    }

    #[Route('/event/save', name: 'app_new_event', methods: ['POST'])]
    public function saveEvent(Request $request, EntityManagerInterface $entityManager)
    {
        $this->denyAccessUnlessGranted('ROLE_USER');

        /** @var User $user */
        $user = $this->getUser();

        $event = new Event;
        $form = $this->createForm(EventType::class, $event);
        $form->handleRequest($request);

        if ($form->isSubmitted() && $form->isValid()) {
            $event->setAgenda($user->getAgenda());

            $entityManager->persist($event);
            $entityManager->flush();

            return $this->json(json_encode($event->toFullCalendarJsArray()));
        }

        return $this->json(json_encode('Bad request'), 400);
    }
}
